import React from "react";

export default function Category({image , name}) {
  return (
    <div>
        <img
          class="w-20 h-20 rounded-full ring-2 ring-blue-600 dark:ring-gray-500 "
          src={image ? image : "Unkonw"}alt=""/>
          <span class="p-2">{name ? name : "Unknow"}</span>
    </div>
  );
}
