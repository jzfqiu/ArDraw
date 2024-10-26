import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import './App.css';

interface Rectangle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

const App: React.FC = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [nextId, setNextId] = useState(1);
  const appRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDrawing && appRef.current) {
      const rect = appRef.current.getBoundingClientRect();
      setStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing && appRef.current) {
      const rect = appRef.current.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;
      const width = Math.abs(endX - startPos.x);
      const height = Math.abs(endY - startPos.y);
      const x = Math.min(startPos.x, endX);
      const y = Math.min(startPos.y, endY);

      const updatedRectangles = rectangles.slice(0, -1);
      updatedRectangles.push({ id: nextId, x, y, width, height, text: '' });
      setRectangles(updatedRectangles);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setNextId(nextId + 1);
    }
  };

  const handleTextChange = (id: number, text: string) => {
    const updatedRectangles = rectangles.map(rect =>
      rect.id === id ? { ...rect, text } : rect
    );
    setRectangles(updatedRectangles);
  };

  return (
    <div
      className="App"
      ref={appRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <button onClick={() => setIsDrawing(!isDrawing)}>
        {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
      </button>
      {rectangles.map((rect) => (
        <Rnd
          key={rect.id}
          size={{ width: rect.width, height: rect.height }}
          position={{ x: rect.x, y: rect.y }}
          onDragStop={(e, d) => {
            const updatedRectangles = rectangles.map(r =>
              r.id === rect.id ? { ...r, x: d.x, y: d.y } : r
            );
            setRectangles(updatedRectangles);
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            const updatedRectangles = rectangles.map(r =>
              r.id === rect.id ? {
                ...r,
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                x: position.x,
                y: position.y
              } : r
            );
            setRectangles(updatedRectangles);
          }}
          enableResizing={{ bottomRight: true }}
          resizeHandleClasses={{ bottomRight: 'resize-handle' }}
        >
          <textarea
            value={rect.text}
            onChange={(e) => handleTextChange(rect.id, e.target.value)}
            style={{ width: '100%', height: '100%', border: 'none', resize: 'none' }}
          />
        </Rnd>
      ))}
    </div>
  );
};

export default App;
