/* eslint-disable no-undef, @typescript-eslint/explicit-function-return-type */
// ==UserScript==
// @name         SITCON X 蒙太奇照片牆 Flickr Photo Collector
// @namespace    https://moontai0724.tw/
// @version      1.0
// @description  協助 SITCON X 各年份照片挑選的工作！蒙太奇照片牆就靠你
// @author       moontai0724
// @match        https://www.flickr.com/photos/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flickr.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// ==/UserScript==

(function () {
  "use strict";
  let collector = GM_getValue("collector", null);
  if (!collector) {
    collector = window.prompt(
      "[SITCON X Photo Collector] 請輸入你的名字以利回報後的後續整理：",
    );
    if (!collector) collector = "使用者不想給名字 QQ";
    GM_setValue("collector", collector);
  }

  const button = document.createElement("button");
  button.id = "collect-to-sitcon-x-db";
  button.innerText = "收藏到 SITCON X 照片庫";
  button.addEventListener("click", () => {
    document.getElementById("collect-to-sitcon-x-db").disabled = true;
    const photoId = /\/sitcon\/(\d+)\//.exec(location.href)[1];
    const url = location.href;
    const photoTitle = document.querySelector(".photo-title").textContent;
    const dateTaken = document
      .querySelector(".date-taken-label")
      .textContent.trim();

    const albumElements = document.querySelectorAll(
      ".sub-photo-context-albums ul.context-list li",
    );
    const albums = Array.from(albumElements).map(element => {
      const id = element.getAttribute("data-context-id");
      const title = element.querySelector("span.title").textContent;
      return { id, title };
    });

    submit({
      collector,
      photoTitle,
      photoId,
      albums,
      dateTaken,
      url,
    })
      .then(value => window.alert(`成功！大感謝 >< (${value.message})`))
      .catch(() => window.alert("壞掉了... QQ 幫我截圖 console 回報一下 QQ"));
  });
  document.querySelector(".title-desc-block").after(button);

  /**
   * Fetch accounts from Bahamut server.
   * @returns Array of accounts.
   */
  function submit(data) {
    return new Promise((resolve, reject) => {
      console.info("SITCON X Photo Collector: Sending data: ", data);
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://script.google.com/macros/s/AKfycbyrrRSZuTTjun9bzF3NNABv3btOJB8DawjJUcO7YLUUL8XdK81_N04kSbpzL7zZ-G6OFQ/exec",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        data: JSON.stringify(data),
        responseType: "json",
        onload: response => {
          console.info("SITCON X Photo Collector: Got response: ", response);
          resolve(response.response);
        },
        onerror: err => {
          console.error("SITCON X Photo Collector: Responsed Error: ", err);
          reject(err);
        },
        ontimeout: () => {
          console.error("SITCON X Photo Collector: Response timeout: ");
          reject();
        },
      });
    });
  }
})();
