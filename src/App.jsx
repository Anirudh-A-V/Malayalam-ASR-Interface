import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { BsFillPauseFill, BsStopFill, BsFillPlayFill } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";

import "./index.css";
import Wave from "./Components/Wave";
import Ripple from "./Components/Ripple";

export default function App() {
	const [isOpen, setIsOpen] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [recording, setRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState(null);
	const [uploaded, setUploaded] = useState(false);
	const [convertedAudio, setConvertedAudio] = useState(null);
	const [hasConverted, setHasConverted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [hover, setHover] = useState(false);

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
		setIsPaused(true);
	};

	const resumeRecording = () => {
		mediaRecorderRef.current.resume();
		setIsPaused(false);
	};

	const stopRecording = () => {
		mediaRecorderRef.current.stop();
		setRecording(false);

		convertAudio()
	};

	const convertAudio = async () => {
		handleLoading(true)

		const url = 'http://gokulgmenon.pythonanywhere.com/post';

		const formData = new FormData();
		formData.append('file', audioBlob);

		const response = await fetch(url, {
			method: 'POST',
			body: formData
		});

		if (response.status >= 200 && response.status < 300) {
			console.log('success')
			setHasConverted(true)
			const blob = await response.blob();
			const blobURL = window.URL.createObjectURL(blob);
			setLoading(false)
			setConvertedAudio(blobURL)
			// const link = document.createElement('a');
			// link.href = blobURL;
			// link.download = 'audio.mp3';
			// link.click();

		} else {
			console.log(response)
			setLoading(false)
		}

	}

	const handleLoading = (load) => {
		setTimeout(() => {
			setLoading(load)
		}, 700)
	}

	const handleHover = () => {
		setTimeout(() => {
			setHover(false)
		}, 300)
	}

	return (
		<>
			<div className="flex justify-center items-center flex-col">
				<div className=" mb-24 mt-14 flex flex-col items-center justify-center">
					<div className="text-8xl text-transparent title font-bold font-outline-2">
						Malayalam
					</div>
					<div className="title text-8xl text-[#F6F8FB] title font-bold">
						XLSR Model
					</div>
				</div>
				<Ripple on={loading}>
					<motion.div
						layout
						data-isopen={isOpen}
						initial={{ borderRadius: 50 }}
						className="parent mt-12 cursor-pointer"
					>
						{/* <span class="loader"> */}
						{isOpen ? (
							<>
								<Wave />
								<motion.div className="buttons">
									<motion.div
										layout
										className="child"
										data-isopen={isOpen}
										onClick={() => {
											stopRecording()
											setIsOpen(!isOpen)
										}}
									>
										<BsStopFill className="controls stop" />
									</motion.div>
									{isPaused ? (
										<motion.div
											className="child"
											data-isopen={isOpen}
											onClick={resumeRecording}
										>
											<BsFillPlayFill className="controls pause" />
										</motion.div>
									) : (
										<motion.div
											className="child"
											data-isopen={isOpen}
											onClick={pauseRecording}
										>
											<BsFillPauseFill className="controls pause" />
										</motion.div>
									)}
								</motion.div>
							</>
						) : (
							<motion.div
								layout
								className="child"
								data-isopen={isOpen}
								onClick={() => {
									startRecording()
									setIsOpen(!isOpen)
								}}
							>
								<div className="circle" />
							</motion.div>
						)}
						{/* </span> */}
					</motion.div>
				</Ripple>
				{/* {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} className="mt-10" />} */}

				<audio controls src={convertedAudio} className="mt-10 hidden" autoPlay={true} />
			</div>
			<div className="details">
				<div className="flex flex-col items-start justify-center">
					<div className="text-base text-[#F6F8FB] title font-bold">
						Research Paper by Kavya Suresh
					</div>
					<div className="text-sm text-[#F6F8FB] title font-bold">
						Research Intern at IIT Madras
					</div>
					<div className="text-sm text-[#F6F8FB] title font-bold">
						Gokul G Menon, Ashish Abraham
					</div>
				</div>
			</div>
			<motion.div className="floating cursor-pointer"
				layout
				transition={{ duration: 0.3, ease: "backOut" }}

				data-onhover={hover}
				initial={{ borderRadius: 50 }}
				onMouseEnter={() => { setHover(true) }}
				onMouseLeave={() => { handleHover() }}
			>
				{hover && <motion.p className="text-xl font-normal text-[#F6F8FB] ">Get the Research Paper</motion.p>}
				<HiDownload className="icon text-4xl text-[#F6F8FB] cursor-pointer rounded-full p-1" onClick={() => { }} />
				{/* {hover ? (
					<>
						<motion.p className="text-xl font-normal text-[#F6F8FB] ">Get the Research Paper</motion.p>
						<HiDownload className="icon text-4xl text-[#F6F8FB] cursor-pointer rounded-full p-1" onClick={() => { }} />
					</>) : (
					<>
						<HiDownload className="icon text-4xl text-[#F6F8FB] cursor-pointer rounded-full p-1" onClick={() => { }} />
					
				)} */}
			</motion.div>
		</>
	);
}
