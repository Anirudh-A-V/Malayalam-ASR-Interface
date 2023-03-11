import './Ripple.css'

const Ripple = ({children, on}) => {

    if (!on) {
        return (
            <>
             {children}
            </>
        )
    }

    return (
        <div class="ripple-container">
            <div class="circular-div">
                {children}
                {/*  Your circular div content here */}
            </div>
        </div>
    )
}

export default Ripple