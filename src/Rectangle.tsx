import type { Rect as RectType } from "konva/lib/shapes/Rect";
import type { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import { useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";
import type { IShapeProps } from "./App";

interface IRectangleProps {
    isSelected: boolean,
    shapeProps: IShapeProps,
    onSelect: () => void,
    onChange: (shapeProps: IShapeProps) => void
}

function Rectangle({ shapeProps, isSelected, onSelect, onChange }: IRectangleProps) {
    const shapeRef = useRef<RectType | null>(null);
    const trRef = useRef<TransformerType | null>(null);

    useEffect(() => {
        if (isSelected && trRef.current && shapeRef.current) {
            trRef.current.nodes([shapeRef.current]);
        }
    }, [isSelected]);

    return (
        <>
            <Rect
                onClick={onSelect}
                onDblClick={onSelect}
                ref={shapeRef}
                x={shapeProps.x}
                y={shapeProps.y}
                width={shapeProps.width}
                height={shapeProps.height}
                stroke={shapeProps.stroke}
                strokeWidth={2}
                cornerRadius={5}
                draggable
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y()
                    });
                }}
                onTransformEnd={() => {
                    const node = shapeRef.current;

                    if (node === null)
                        return;

                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    flipEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
};

export default Rectangle;