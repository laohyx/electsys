/**
 * Electsys++ Project
 * ----------------------------
 * Sys.UI.DomElement 补丁
 * 修复了页面滚动后滑条失效的问题
 */

function patch_fix_dom_element() {
    jQuery(document).ready(function () {
        // Apply patch into original scripts
        jQuery('body').append(`
        <script>
        console.log(Sys.UI.DomElement.getLocation);
        if (Sys.UI.DomElement) {
            Sys.UI.DomElement.getLocation = function DomElement$getLocation(element) {
                /// <summary locid="M:J#Sys.UI.DomElement.getLocation">Gets the coordinates of a DOM element.</summary>
                /// <param name="element" domElement="true"></param>
                /// <returns type="Sys.UI.Point">A Point object with two fields, x and y, which contain the pixel coordinates of the element.</returns>
                var e = Function._validateParams(arguments, [{
                    name: "element",
                    domElement: true
                }]);
                if (e)
                    throw e;
                if (element.self ||
                    element.nodeType === 9 ||
                    (element === document.documentElement) ||
                    (element.parentNode === element.ownerDocument.documentElement)) {
                    return new Sys.UI.Point(0,0);
                }
                var clientRect = element.getBoundingClientRect();
                if (!clientRect) {
                    return new Sys.UI.Point(0,0);
                }
                // 原脚本此处可能得到浮点值的 offsetX 和 offsetY，导致后续脚本出错，此处已修正
                var ex, ownerDoc = element.ownerDocument,
                    documentElement = ownerDoc.documentElement,
                    offsetX = Math.round(clientRect.left + (documentElement.scrollLeft || (ownerDoc.body ? ownerDoc.body.scrollLeft : 0))),
                    offsetY = Math.round(clientRect.top + (documentElement.scrollTop || (ownerDoc.body ? ownerDoc.body.scrollTop : 0)));
                return new Sys.UI.Point(offsetX,offsetY);
            }
        }
        </script>
        `);
    });
}