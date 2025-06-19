import { useEffect, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';

import Rectangle from './Rectangle';

import './App.css'
import type Konva from 'konva';
import type { DrawingRectangle, Rectangle as RectangleType } from './types';

export interface IShapeProps {
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  stroke: string
}

function App() {
  const [items, setItems] = useState<RectangleType[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [drawingRectangle, setDrawingRectangle] = useState<DrawingRectangle>({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const handleOnMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage())
      return;

    setSelectedShapeId(null);

    const pos = e.target.getStage().getPointerPosition();

    if (pos === null)
      return;

    setDrawingRectangle({
      x1: pos.x,
      y1: pos.y,
      x2: pos.x,
      y2: pos.y,
      visible: true
    });
  }

  const handleOnMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();

    if (stage) {
      stage.container().style.cursor = "default";
    }

    const newItem = {
      id: crypto.randomUUID(),
      x: Math.min(drawingRectangle.x1, drawingRectangle.x2),
      y: Math.min(drawingRectangle.y1, drawingRectangle.y2),
      width: Math.abs(drawingRectangle.x2 - drawingRectangle.x1),
      height: Math.abs(drawingRectangle.y2 - drawingRectangle.y1),
      stroke: "black"
    };

    setItems(prev => [
      ...prev,
      newItem
    ]);

    setTimeout(() => {
      setDrawingRectangle({
        ...drawingRectangle,
        visible: false,
      });
    });
  }

  const handleOnMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();

    if (!pos)
      return;

    setDrawingRectangle({
      ...drawingRectangle,
      x2: pos.x,
      y2: pos.y,
    });
  }

  const handleClearOnClick = () => {
    setItems([]);
  }

  const deleteSelectedShape = () => {
    const selectedShape = items.find(item => item.id === selectedShapeId);

    if (!selectedShape)
      return;

    setItems(prev => [
      ...prev.filter(prevItem => prevItem.id !== selectedShapeId)
    ]);
    setSelectedShapeId(null);
  }

  const handleOnKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Delete": {
        deleteSelectedShape();
        break;
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleOnKeyDown);

    return () => window.removeEventListener("keydown", handleOnKeyDown);
  });

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
          {items.map((item, i) => {
            return (
              <Rectangle
                key={item.id}
                shapeProps={item}
                isSelected={item.id === selectedShapeId}
                onSelect={() => {
                  setSelectedShapeId(item.id);
                }}
                onChange={(newAttrs) => {
                  const tempItems = items.slice();
                  tempItems[i] = newAttrs;
                  setItems(tempItems);
                }}
              />
            );
          })}
          {drawingRectangle.visible && (
            <Rect
              x={Math.min(drawingRectangle.x1, drawingRectangle.x2)}
              y={Math.min(drawingRectangle.y1, drawingRectangle.y2)}
              width={Math.abs(drawingRectangle.x2 - drawingRectangle.x1)}
              height={Math.abs(drawingRectangle.y2 - drawingRectangle.y1)}
              cornerRadius={5}
              stroke="black"
            />
          )}
        </Layer>
      </Stage>
      <div className='btn-wrapper'>
        <button type='button' onClick={handleClearOnClick}>Clear</button>
      </div>
    </div>
  )
}

export default App
