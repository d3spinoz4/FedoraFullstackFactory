import { useRef, useState } from 'react';
import axios from 'axios';

const AddTask = ({ onAdd }) => {
  const [text, setText] = useState('')
  const [day, setDay] = useState('')
  const [file, setFile] = useState(''); // storing the uploaded file
  const [file_path, setDF] = useState(''); // storing the uploaded file
  const [reminder, setReminder] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()

    if (!text) {
      alert('Please add a task')
      return
    } else if (file.type !== "text/tab-separated-values") {
        alert('File must be Tab Separated Values')
        return
    }

    onAdd({ text, day, file_path, reminder })

    setText('')
    setDay('')
    setDF('')
    setReminder(false)
  }
  
    // storing the recived file from backend
    const [data, getFile] = useState({ name: "", path: "" });
    const [progress, setProgess] = useState(0); // progess bar
    const el = useRef(); // accesing input element
    const handleChange = (e) => {
        setProgess(0)
        const file = e.target.files[0]; // accesing file
	setDF(file.name);
        setFile(file); // storing file
    }
    const uploadFile = () => {
        const formData = new FormData();
        formData.append('file', file); // appending file
        axios.post('http://HOST_IP:80/upload', formData, {
            onUploadProgress: (ProgressEvent) => {
                let progress = Math.round(
                ProgressEvent.loaded / ProgressEvent.total * 100) + '%';
                setProgess(progress);
            }
        }).then(res => {
            getFile({ name: res.data.name,
                     path: 'http://HOST_IP:80' + res.data.path
                   })
        }).catch(err => console.log(err))}

  return (
    <form className='add-form' onSubmit={onSubmit}>
      <div className='form-control'>
        <label>Task</label>
        <input
          type='text'
          placeholder='Add Task'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className='form-control'>
        <label>Day & Time</label>
        <input
          type='text'
          placeholder='Add Day & Time'
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
      </div>
      <div>
          <div className="file-upload">
	  <label>Image </label>
	  {/*progress*/}
            <hr />
                <input type="file" accept=".tsv" placeholder='Add Image' ref={el} onChange={handleChange} /> <label> progress </label> {progress}
	  <br />
                <div className="progessBar" style={{ width: progress }}>
                </div>
            <hr />
            </div>
        </div>
      <div className='form-control form-control-check'>
        <label>Disable Reminder</label>
        <input
          type='checkbox'
          checked={reminder}
          value={reminder}
          onChange={(e) => setReminder(e.currentTarget.checked)}
        />
      </div>

      <input type='submit' value='Save Task' onClick={uploadFile} className='btn btn-block' />
    </form>
  )
}

export default AddTask

