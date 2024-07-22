"use strict";exports.getCurrentDateFormatted=t=>{const e=t?new Date(t):new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`};
