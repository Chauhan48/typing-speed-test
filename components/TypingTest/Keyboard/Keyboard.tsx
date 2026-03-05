
const Keyboard = () => {

    const keys: (number[] | string[])[] = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"]]

    return (
        <div>
            {keys.map((row, index) => (
                <div key={index} className="flex justify-center mb-2">
                    {row.map((key) => (
                        <div key={key} className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center mx-1">
                            {key}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Keyboard