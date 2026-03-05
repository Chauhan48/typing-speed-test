import TextDisplay from "@/components/TypingTest/TextDisplay";
import Timer from "@/components/TypingTest/Timer";
import TypingBox from "@/components/TypingTest/TypingBox";

export default function Practice() {
    return (
        <div>
            <Timer />
            <TextDisplay />
            <TypingBox />
        </div>
    )
}