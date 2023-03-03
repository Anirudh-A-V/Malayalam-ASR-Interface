import { useContext, useRef } from "react"
import { StateContext } from "./contexts/ContextProvider"

export default function App() {
  const { recording, setRecording, pause, setPause, audioBlob, setAudioBlob, recordings, setRecordings, uploaded, setUploaded } = useContext(StateContext)

  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();

    const chunks = [];
    mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });

    mediaRecorderRef.current.addEventListener("stop", () => {
      setAudioBlob(new Blob(chunks));
    });

    setRecording(true);
    setUploaded(false);
  };

  const pauseRecording = () => {
    mediaRecorderRef.current.pause();
    setPause(true);
  };

  const resumeRecording = () => {
    mediaRecorderRef.current.resume();
    setPause(false);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);

  };

  return (
    <>
      <main className="container">
        <h1>React Media Recorder</h1>
        <div className="record-audio">
          {recording && pause && <button className="record-resume" onClick={resumeRecording}>Resume Recording</button>}
          {recording && !pause && <button className="record-pause" onClick={pauseRecording}>Pause Recording</button>}
          {recording ? (
            <>
              <button className="record-stop" onClick={stopRecording}>Stop Recording</button>
            </>
          ) : (
            <button className="record-start" onClick={startRecording}>Start Recording</button>
          )}
          {/* {audioBlob && !recording && !uploaded && <button className="record-upload" onClick={uploadAudio}>Upload Audio</button>} */}
          {audioBlob && !recording && !uploaded && <audio controls src={URL.createObjectURL(audioBlob)} />}
        </div>
      </main>
      {recordings.length > 0 &&
        <div className="recorded-audios">
          <h2>Recorded Audios</h2>
          <div className="recorded-audios-list">
            {recordings.map(recording => (
              <div className="recorded-audio" key={recording.id}>
                <audio controls src={recording.url} />
                <FaTrash className="record-delete" onClick={() => deleteRecording(recording.id)}/>
              </div>
            ))}
          </div>
        </div>
      }
    </>
  )
}
