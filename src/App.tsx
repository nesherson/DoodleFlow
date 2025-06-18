import { useState } from 'react';
import { Stage, Layer, Rect, Group } from 'react-konva';

import './App.css'
import type Konva from 'konva';

type RectType = {
  id: number,
  x: number,
  y: number,
  width: number,
  height: number
}

type CanvasAction = {
  shapeId: number,
  action: Action
}

enum Action {
  Drawing = 0,
  Resizing = 1
}

function App() {
  const [items, setItems] = useState<RectType[]>([]);
  const [canvasAction, setCanvasAction] = useState<CanvasAction | null>(null);

  const handleOnMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target.parent !== null) {
      return;
    }

    const newItem = { id: items.length + 1, x: e.evt.offsetX, y: e.evt.offsetY, width: 1, height: 1 };

    setCanvasAction({ shapeId: newItem.id, action: Action.Drawing });
    setItems(prev => [
      ...prev,
      newItem
    ]);

  }

  const handleOnMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();

    if (stage) {
      stage.container().style.cursor = "default";
    }
    setCanvasAction(null);
  }

  const handleOnMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    switch (canvasAction?.action) {
      case Action.Drawing: {
        const itemToDraw = items.find(i => i.id === canvasAction?.shapeId);

        if (!itemToDraw)
          return;

        const startPosX = itemToDraw.x;
        const startPosY = itemToDraw.y;
        const endPosX = e.evt.offsetX;
        const endPosY = e.evt.offsetY;
        let width = endPosX - startPosX;
        let height = endPosY - startPosY;

        if (endPosX < startPosX) {
          width = (startPosX - endPosX) * -1;
        }

        if (endPosY < startPosY) {
          height = (startPosY - endPosY) * -1;
        }

        itemToDraw.width = width;
        itemToDraw.height = height;

        setItems(prev => [
          ...prev.filter(x => x.id !== itemToDraw.id),
          itemToDraw
        ]);

        break;
      }
      case Action.Resizing: {
      }
    }


  }

  const handleClearOnClick = () => {
    setItems([]);
  }

  const handleOuterRectOnMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();

    if (stage === null)
      return;

    stage.container().style.cursor = "col-resize";
  }

  const handleOuterRectOnMouseOut = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();

    if (stage === null)
      return;

    stage.container().style.cursor = "default";
  }

  const handleOuterRectOnMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
  }

  const handleOuterRectOnMouseUp = (e: Konva.KonvaEventObject<MouseEvent>, id: number) => {
  }

  const handleInnerRectOnMouseDown = (e: Konva.KonvaEventObject<MouseEvent>, id: number) => {
    const stage = e.target.getStage();

    if (stage) {
      stage.container().style.cursor = "grabbing";
    }
  }

  const handleInnerRectOnMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {


    // setCanvasAction(null);
  }

  return (
    <div className='wrapper'>
      <Stage
        id='canvas'
        width={1200}
        height={720}
        fontSize={15}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseMove={handleOnMouseMove}
        className='canvas'>
        <Layer>
          {
            items.map(item => {
              const x = item.width > 0 ? item.x - 2 : item.x + 2;
              const y = item.height > 0 ? item.y - 2 : item.y + 2;
              const width = item.width > 0 ? item.width + 4 : item.width - 4;
              const height = item.height > 0 ? item.height + 4 : item.height - 4;

              return <Group
                key={item.id}
                draggable={true}>
                <Rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={"black"}
                  onMouseOver={handleOuterRectOnMouseOver}
                  onMouseOut={handleOuterRectOnMouseOut}
                  onMouseDown={handleOuterRectOnMouseDown}
                  onMouseUp={(e) => handleOuterRectOnMouseUp(e, item.id)}
                />
                <Rect
                  x={item.x}
                  y={item.y}
                  width={item.width}
                  height={item.height}
                  fill="green"
                  onMouseDown={(e) => handleInnerRectOnMouseDown(e, item.id)}
                  onMouseUp={handleInnerRectOnMouseUp} />
              </Group>
            })
          }
        </Layer>
      </Stage>
      <button type='button' onClick={handleClearOnClick}>Clear</button>
    </div>
  )
}

export default App
