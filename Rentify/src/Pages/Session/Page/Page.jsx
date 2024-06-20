import { useParams } from "react-router-dom"
import { useEffect, useRef } from "react";

import './Page.css'
export default function Page() {
    const Canvas = useRef();
    const s = useParams();
    console.log(s);
    useEffect(() => {
        adjustCanvas();
    })



    function adjustCanvas() {
        const canvas = Canvas.current;
        const canvasWrapper = canvas.parentNode;
        window.addEventListener('resize', () => {
            const rect = canvasWrapper.getBoundingClientRect().width;
            canvas.height = rect.height;
            canvas.width = rect.width;
        })
    }


    return (
        <div className="page-wrapper">
            <canvas ref={Canvas} className="board">

            </canvas>
            <div className="toolbox">
                <button>
                    addline
                </button>
            </div>
        </div>
    )
}