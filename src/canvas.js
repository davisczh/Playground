import { addRoom } from './geometry.js';
import { updateRoom } from './main.js';
export function createCanvas(scene, room, roomDimensions) {
    const canvas = document.getElementById('canvas');
    // canvas.width = 300; 
    // canvas.height = 150;
    const ctx = canvas.getContext('2d');

    var elementsList = [];
  
    // Function to create a circle
    function createCircle(ctx, x, y, radius, color, id) {
      const path = new Path2D();
      path.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill(path);
      // Add the path and id to the elements list
      elementsList.push({ path: path, id: id });
    }
  
    // Create three circles
    createCircle(ctx, 50, 75, 30, 'red', '0');
    createCircle(ctx, 150, 75, 30, 'red', '1');
    createCircle(ctx, 250, 75, 30, 'red', '2');
  
    // Mouse move event to change cursor style
    canvas.addEventListener('mousemove', function(event) {
      let isPointer = false;
      for (let i = 0; i < elementsList.length; i++) {
        if (ctx.isPointInPath(elementsList[i].path, event.offsetX, event.offsetY)) {
          canvas.style.cursor = 'pointer';
          isPointer = true;
          break; 
        }
      }
      if (!isPointer) {
        canvas.style.cursor = 'default';
      }
    });
  
    // Click event to detect which circle is clicked and return its information
    canvas.addEventListener('click', function(event) {
      for (let i = 0; i < elementsList.length; i++) {
        if (ctx.isPointInPath(elementsList[i].path, event.offsetX, event.offsetY)) {
          console.log('Clicked:', elementsList[i].id);
          console.log(roomDimensions)
          console.log(roomDimensions[elementsList[i].id]);
          const Dimensions = roomDimensions[elementsList[i].id] // Log the id of the clicked circle
          updateRoom(scene, Dimensions);
        }
      }
    });
      
    return canvas;
  }
  