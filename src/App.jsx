// Hicks Drawing App — Clean Drop + Top Menu + Insert Dropdown + Full Properties Panel
import { useState, useRef } from 'react';

export default function App() {
  const [shapes, setShapes] = useState([
    { id: 1, x: 100, y: 100, width: 150, height: 100, label: 'Shape 1', tag: '', part: '', quantity: 1, manufacturer: '', pointType: '', description: '' }
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const canvasRef = useRef(null);

  const handleMouseDown = (e, id) => {
    if (e.button !== 0) return;
    const shape = shapes.find(s => s.id === id);
    setDragOffset({ x: e.clientX - shape.x * zoom, y: e.clientY - shape.y * zoom });
    setSelectedId(id);
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!dragging || selectedId === null) return;
    const newX = (e.clientX - dragOffset.x) / zoom;
    const newY = (e.clientY - dragOffset.y) / zoom;
    setShapes(prev => prev.map(s => s.id === selectedId ? { ...s, x: newX, y: newY } : s));
  };

  const handleMouseUp = () => setDragging(false);

  const handleAddShape = () => {
    const newId = shapes.length + 1;
    setShapes([...shapes, {
      id: newId, x: 100 + newId * 20, y: 100 + newId * 20, width: 150, height: 100, label: `Shape ${newId}`,
      tag: '', part: '', quantity: 1, manufacturer: '', pointType: '', description: ''
    }]);
    setShowInsertMenu(false);
  };

  const zoomIn = () => setZoom(z => Math.min(z + 0.1, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));
  const resetZoom = () => setZoom(1);

  const selectedShape = shapes.find(s => s.id === selectedId);

  const updateShapeProperty = (key, value) => {
    setShapes(prev => prev.map(s => s.id === selectedId ? { ...s, [key]: value } : s));
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col select-none">
      {/* Top Menu */}
      <div className="relative bg-gray-950 text-sm text-white px-4 py-2 flex gap-6 border-b border-gray-800">
        <div className="cursor-pointer hover:text-blue-400">File</div>
        <div className="relative">
          <div
            className="cursor-pointer hover:text-blue-400"
            onClick={() => setShowInsertMenu(!showInsertMenu)}
          >
            Insert
          </div>
          {showInsertMenu && (
            <div className="absolute bg-gray-800 top-full mt-1 left-0 p-2 rounded shadow-md z-10">
              <div onClick={handleAddShape} className="px-2 py-1 hover:bg-gray-700 rounded cursor-pointer">Add Shape</div>
            </div>
          )}
        </div>
        <div className="cursor-pointer hover:text-blue-400">Tools</div>
        <div className="cursor-pointer hover:text-blue-400">View</div>
        <div className="cursor-pointer hover:text-blue-400">Help</div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800 text-sm flex gap-6 p-2 pl-4 border-b border-gray-700">
        <div className="ml-auto flex gap-2">
          <button onClick={zoomOut}>-</button>
          <button onClick={resetZoom}>Reset</button>
          <button onClick={zoomIn}>+</button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 overflow-hidden" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
          <div ref={canvasRef} className="relative w-full h-full" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
            {shapes.map(shape => (
              <div
                key={shape.id}
                onMouseDown={(e) => handleMouseDown(e, shape.id)}
                className="absolute bg-gray-700 border border-white text-center cursor-move"
                style={{ left: shape.x, top: shape.y, width: shape.width, height: shape.height }}
              >
                {shape.label}
              </div>
            ))}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedShape && (
          <div className="w-72 bg-gray-800 border-l border-gray-700 p-4 text-sm overflow-auto">
            <h2 className="text-lg mb-2">Properties</h2>
            {['label', 'tag', 'part', 'quantity', 'manufacturer', 'pointType', 'description'].map(key => (
              <div key={key} className="mb-2">
                <label className="block mb-1 capitalize">{key}</label>
                <input
                  type={key === 'quantity' ? 'number' : 'text'}
                  className="w-full p-1 rounded bg-gray-700 border border-gray-600"
                  value={selectedShape[key] ?? ''}
                  onChange={e => updateShapeProperty(key, key === 'quantity' ? parseInt(e.target.value) : e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
