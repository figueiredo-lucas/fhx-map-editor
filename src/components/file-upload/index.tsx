import React, { ChangeEvent } from 'react'
import { FileParser } from '../../services/fileparser';
import './style.css';

const FileUpload = (props: any) => {

  const loadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const fr = new FileReader();
    fr.onload = () => {
      const buff: ArrayBuffer = fr.result as ArrayBuffer;
      console.log('Loaded BWH file.', buff.byteLength);
      const parser = new FileParser();
      const bwhFile = parser.parse(buff, (input.files && input.files[0].name) || '', (input.files && input.files[0].size) || 0);
      props.setMap(bwhFile);
    }

    if (input.files && input.files.length > 0) {
      fr.readAsArrayBuffer(input.files[0]);
    }
  }
  return (
    <div>
      <input type="file" className="bwh-file" name="bwh-file" id="bwh-file-upload" placeholder="Click to select..." accept=".bwh" onChange={loadFile} />
    </div>
  )
}

export default FileUpload;
