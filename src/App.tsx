import { useState } from 'react';
import { Stage, Layer, Text, Circle, Group } from 'react-konva';

import './App.css'

function App() {
  const [circles, setCircles] = useState<{ x: number, y: number, radius: number }[]>([]);
  const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);

  const handleOnMouseDown = (e) => {
    setStartPos({
      x: e.evt.offsetX,
      y: e.evt.offsetY
    })

    console.log("UP -> ", e);


    // if (e.target.index !== 0)
    //   return;

    // setCircles(prev => [
    //   ...prev,
    //   {
    //     x: xPos,
    //     y: yPos
    //   }
    // ])
  }

  const handleOnMouseUp = (e) => {

    if (startPos === null)
      return;

    const endPosX = e.evt.offsetX;
    const endPosY = e.evt.offsetY;

    const newCircle = { x: startPos.x, y: startPos.y, radius: endPosX - startPos.x };

    setCircles(prev => [
      ...prev,
      newCircle
    ])
  }

  const handleClearOnClick = () => {
    setCircles([]);
  }

  return (
    <div className='wrapper'>
      <Stage width={800} height={600} fontSize={15} onMouseDown={handleOnMouseDown} onMouseUp={handleOnMouseUp}>
        <Layer >
          <Text text='Test 123' />
          {
            circles.map((c, i) => (
              <Group
                key={i}>
                <Circle
                  x={c.x}
                  y={c.y}
                  radius={c.radius + 2}
                  fill={"black"}
                />
                <Circle
                  x={c.x}
                  y={c.y}
                  onClick={(e) => console.log(e)}
                  radius={c.radius}
                  fill="green">

                </Circle>
              </Group>
            ))
          }
        </Layer>
      </Stage>
      <button type='button' onClick={handleClearOnClick}>Clear</button>
    </div>
  )
}

export default App
