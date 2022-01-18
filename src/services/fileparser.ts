import { Buffer } from 'buffer';
import { BWH } from '../shared/bwh';
import { Field } from '../shared/field';
import { Ogg } from '../shared/ogg';
import { RGB } from '../shared/rgb';

export class FileParser {
  parse(data: ArrayBuffer, filename: string, size: number): BWH {
    const buffer = Buffer.from(data);
    const bwhFile: BWH = {} as BWH;
    bwhFile.filename = filename;
    bwhFile.size = size;
    let position = 0;
    bwhFile.header = buffer.toString('utf-8', position, 7);
    position += 7;
    bwhFile.version = buffer.readInt32LE(position);
    position += 4;
    bwhFile.height = buffer.readInt32LE(position);
    position += 4;
    bwhFile.width = buffer.readInt32LE(position);
    position += 4;
    bwhFile.corner1 = buffer.readFloatLE(position);
    position += 4;
    bwhFile.zero1 = buffer.readFloatLE(position);
    position += 4;
    bwhFile.corner2 = buffer.readFloatLE(position);
    position += 4;
    bwhFile.corner3 = buffer.readFloatLE(position);
    position += 4;
    bwhFile.zero2 = buffer.readFloatLE(position);
    position += 4;
    bwhFile.corner4 = buffer.readFloatLE(position);
    position += 4;
    bwhFile.blocks = buffer.readInt32LE(position);
    position += 4;
    bwhFile.blockwidth = buffer.readInt32LE(position);
    position += 4;
    bwhFile.blockheight = buffer.readInt32LE(position);
    position += 4;
    bwhFile.unk1 = buffer.readInt32LE(position);
    position += 4;
    bwhFile.unk2 = buffer.readInt32LE(position);
    position += 4;
    for (let i = 0; i < 9; i++) {
      position = this.parseLodFromBuffer(bwhFile, buffer, position, i);
    }
    bwhFile.unk3 = buffer.readInt32LE(position);
    position += 4;
    for (let i = 0; i < bwhFile.height * bwhFile.width; i++) {
      position = this.parseZoneFromBuffer(bwhFile, buffer, position);
    }
    bwhFile.count_music = buffer.readInt32LE(position);
    position += 4;
    for (let i = 0; i < bwhFile.count_music; i++) {
      position = this.parseOggFromBuffer(bwhFile, buffer, position);
    }
    console.log('Parsed successfully');
    return bwhFile;
  }

  generate(bwhFile: BWH) {
    const buff = Buffer.alloc(bwhFile.size);
    let position = 0;
    buff.write(bwhFile.header, position, 7, 'utf-8');
    position += 7;
    buff.writeInt32LE(bwhFile.version, position);
    position += 4;
    buff.writeInt32LE(bwhFile.height, position);
    position += 4;
    buff.writeInt32LE(bwhFile.width, position);
    position += 4;
    buff.writeFloatLE(bwhFile.corner1, position);
    position += 4;
    buff.writeFloatLE(bwhFile.zero1, position);
    position += 4;
    buff.writeFloatLE(bwhFile.corner2, position);
    position += 4;
    buff.writeFloatLE(bwhFile.corner3, position);
    position += 4;
    buff.writeFloatLE(bwhFile.zero2, position);
    position += 4;
    buff.writeFloatLE(bwhFile.corner4, position);
    position += 4;
    buff.writeInt32LE(bwhFile.blocks, position);
    position += 4;
    buff.writeInt32LE(bwhFile.blockwidth, position);
    position += 4;
    buff.writeInt32LE(bwhFile.blockheight, position);
    position += 4;
    buff.writeInt32LE(bwhFile.unk1, position);
    position += 4;
    buff.writeInt32LE(bwhFile.unk2, position);
    position += 4;
    position = this.parseLodFromObject(bwhFile, buff, position);
    buff.writeInt32LE(bwhFile.unk3, position);
    position += 4;
    bwhFile.zone.forEach(zone => {
      position = this.parseZoneFromObject(zone, buff, position);
    });
    buff.writeInt32LE(bwhFile.count_music, position);
    position += 4;
    bwhFile.music.forEach(music => {
      position = this.parseOggFromObject(music, buff, position);
    });
    console.log('Generated successfully');
    return buff;
  }

  // LOD from buffer to Object
  private parseLodFromBuffer(bwhFile: BWH, buff: Buffer, position: number, idx: number): number {
    const stringSize = Math.pow(2, idx + 3) - 4;
    bwhFile.lod = bwhFile.lod || [];
    bwhFile.lod[idx] = {
      lod: buff.readInt32LE(position),
      blank: buff.toString('hex', position + 4, position + 4 + stringSize)
    };
    position += stringSize + 4;
    return position;
  }

  // Zone from buffer to Object
  private parseZoneFromBuffer(bwhFile: BWH, buff: Buffer, position: number): number {
    bwhFile.zone = bwhFile.zone || [];
    const zone: Field = {} as Field;
    zone.name = buff.toString('utf-8', position, position + 20);
    position += 20;
    zone.is_active = buff.readInt8(position);
    position += 1;
    zone.unk = buff.toString('hex', position, position + 3);
    position += 3;
    zone.day_fog = this.parseRGBFromBuffer(buff, position);
    position += 12;
    zone.day_fog_dist = {
      min: buff.readFloatLE(position),
      max: buff.readFloatLE(position + 4)
    }
    position += 8;
    zone.night_fog = this.parseRGBFromBuffer(buff, position);
    position += 12;
    zone.night_fog_dist = {
      min: buff.readFloatLE(position),
      max: buff.readFloatLE(position + 4)
    }
    position += 8;
    zone.original_heaven = this.parseRGBFromBuffer(buff, position);
    position += 12;
    zone.night_heaven = this.parseRGBFromBuffer(buff, position);
    position += 12;
    zone.day_heaven = this.parseRGBFromBuffer(buff, position);
    position += 12;
    bwhFile.zone.push(zone);
    return position;
  }

  // RGB from buffer to Object
  private parseRGBFromBuffer(buff: Buffer, position: number): RGB {
    const rgb: RGB = {} as RGB;
    rgb.r = buff.readFloatLE(position);
    position += 4;
    rgb.g = buff.readFloatLE(position);
    position += 4;
    rgb.b = buff.readFloatLE(position);
    position += 4;
    return rgb;
  }

  // OGG from buffer to Object
  private parseOggFromBuffer(bwhFile: BWH, buff: Buffer, position: number): number {
    bwhFile.music = bwhFile.music || [];
    const ogg: Ogg = {} as Ogg;
    bwhFile.music.push(ogg);
    ogg.name_length = buff.readInt32LE(position);
    position += 4;
    ogg.name = buff.toString('utf-8', position, position + ogg.name_length);
    position += ogg.name_length;
    ogg.unk = buff.toString('utf-8', position, position + 7);
    position += 7;
    ogg.path_length = buff.readInt32LE(position);
    position += 4;
    ogg.path = buff.toString('utf-8', position, position + ogg.path_length);
    position += ogg.path_length;
    return position;
  }

  private parseLodFromObject(bwhFile: BWH, buff: Buffer, position: number): number {
    bwhFile.lod.forEach((lod, idx) => {
      const stringSize = Math.pow(2, idx + 3) - 4;
      buff.writeInt32LE(lod.lod, position);
      position += 4;
      buff.write(lod.blank, position, position + stringSize, 'hex');
      position += stringSize;
    });
    return position;
  }

  private parseZoneFromObject(zone: Field, buff: Buffer, position: number): number {
    buff.write(zone.name, position, position + 20, 'utf-8');
    position += 20;
    buff.writeInt8(zone.is_active, position);
    position += 1;
    buff.write(zone.unk, position, position + 3, 'hex');
    position += 3;
    position = this.parseRGBFromObject(zone.day_fog, buff, position);
    buff.writeFloatLE(zone.day_fog_dist.min, position);
    buff.writeFloatLE(zone.day_fog_dist.max, position + 4);
    position += 8;
    position = this.parseRGBFromObject(zone.night_fog, buff, position);
    buff.writeFloatLE(zone.night_fog_dist.min, position);
    buff.writeFloatLE(zone.night_fog_dist.max, position + 4);
    position += 8;
    position = this.parseRGBFromObject(zone.original_heaven, buff, position);
    position = this.parseRGBFromObject(zone.night_heaven, buff, position);
    position = this.parseRGBFromObject(zone.day_heaven, buff, position);
    return position;
  }

  private parseRGBFromObject(rgb: RGB, buff: Buffer, position: number): number {
    buff.writeFloatLE(rgb.r, position);
    position += 4;
    buff.writeFloatLE(rgb.g, position);
    position += 4;
    buff.writeFloatLE(rgb.b, position);
    position += 4;
    return position;
  }

  private parseOggFromObject(music: Ogg, buff: Buffer, position: number): number {
    buff.writeInt32LE(music.name_length, position);
    position += 4;
    buff.write(music.name, position, position + music.name_length, 'utf-8');
    position += music.name_length;
    buff.write(music.unk, position, position + 7, 'utf-8');
    position += 7;
    buff.writeInt32LE(music.path_length, position);
    position += 4;
    buff.write(music.path, position, position + music.path_length, 'utf-8');
    position += music.path_length;
    return position;
  }
}
