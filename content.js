/**
 * Searches an element for any descendant <span> that has the expected style attribute
 * and text formatted as a resolution (e.g. "1920x1080" or "866x1,300").
 * If found, it computes and returns the area (width * height).
 * If no valid resolution is found, it returns 0.
 */
function getResolutionArea(element) {
    // Query all descendant <span> elements with the exact style attribute.
    const spans = element.querySelectorAll('span[style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden"]');
    
    // Loop through each matching span.
    for (const span of spans) {
      const text = span.textContent.trim();
      
      // Regex explanation:
      //   - ^ and $ ensure we match the entire text.
      //   - (\d{1,3}(?:,\d{3})*|\d+) matches a number that may include commas (e.g. "1,300")
      //   - \s*x\s* matches the letter "x" optionally surrounded by spaces.
      //   - The second group is similar to the first.
      const match = text.match(/^(\d{1,3}(?:,\d{3})*|\d+)\s*x\s*(\d{1,3}(?:,\d{3})*|\d+)$/);
      
      if (match) {
        // Remove commas (if any) and convert the numbers.
        const width = parseInt(match[1].replace(/,/g, ''), 10);
        const height = parseInt(match[2].replace(/,/g, ''), 10);
        return width * height;
      }
    }
    
    // No valid resolution span was found – return 0.
    return 0;
  }
  
  /**
   * Finds all children within the container, computes their resolution areas (if any),
   * filters to include only those that have a valid resolution, and then sorts them.
   */
  function sortElementsByResolution() {
    chrome.storage.local.get('sortingEnabled', function(data) {
      if (!data.sortingEnabled) return;

      const targetElement = document.querySelector('div[jsname="bVqjv"].YmvwI[selected]');
      if (targetElement && targetElement.textContent.trim() === "Exact matches") {
          // Adjust the selector to target the container element (using its class, id, etc.)
          const container = document.querySelector(".dURPMd");
          if (!container) {
          console.warn('Container with class "dURPMd" not found.');
          return;
          }
          
          // Convert the container's children into an array.
          const items = Array.from(container.children);
          
          // For each child element, compute its resolution area.
          // Only children with a valid resolution (area > 0) will be included.
          const itemsWithArea = items.map(item => ({
          element: item,
          area: getResolutionArea(item)
          }));
          
          // Filter: only keep elements where a valid resolution was found.
          const validItems = itemsWithArea.filter(item => item.area > 0);
          
          // Sort the valid items by resolution area in descending order (highest resolution first).
          validItems.sort((a, b) => b.area - a.area);
          
          // (Optional) If you want to place items without a valid resolution separately,
          // you could also process them here.
          
          // Remove all current children from the container.
          container.innerHTML = '';
          
          // Append the sorted items back into the container.
          validItems.forEach(item => container.appendChild(item.element));
      }
    });
  }
  
sortElementsByResolution();