import ModeSelector from "../TestConfig/ModeSelector"
import StartButton from "../TestConfig/StartButton"
import TimeSelector from "../TestConfig/TimeSelector"

const Dashboard = () => {
  return (
    <div>
        <h3>Typing Master</h3>
        <p>Master your keyboard. Test and improve your typing speed.</p>
        <div className="border  p-4 m-4">
            Configure your test
            <TimeSelector />
            <ModeSelector />
            <StartButton />
        </div>
    </div>
  )
}

export default Dashboard