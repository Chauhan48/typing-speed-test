import ModeSelector from "../TestConfig/ModeSelector"
import TimeSelector from "../TestConfig/TimeSelector"

const Dashboard = () => {
  return (
    <div>
        <h3>Typing Master</h3>
        <p>Master your keyboard. Test and improve your typing speed.</p>
        <div>
            Configure your test
            <TimeSelector />
            <ModeSelector />
        </div>
    </div>
  )
}

export default Dashboard