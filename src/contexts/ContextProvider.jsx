import { createContext, useState } from "react";

const StateContext = createContext();

const ContextProvider = ({ children }) => {
    const [recording, setRecording] = useState(false);
    const [pause, setPause] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordings, setRecordings] = useState([]);
    const [uploaded, setUploaded] = useState(false);

    return (
        <StateContext.Provider value={{
            recording,
            setRecording,
            pause,
            setPause,
            audioBlob,
            setAudioBlob,
            recordings,
            setRecordings,
            uploaded,
            setUploaded
        }}>
            {children}
        </StateContext.Provider>
    )
}

export { StateContext, ContextProvider };