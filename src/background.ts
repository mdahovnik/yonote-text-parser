import {appSettings} from "./constants.ts";
// import {SettingList} from "./types.ts";

// type TMessage = {
//   action: keyof typeof ACT;
//   data: {
//     id?: string,
//     newSettings?: SettingList,
//     words?: number
//   }
// }

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    "settings": appSettings,
    "documents": []
  });
});

//
// //TODO: вывод счетчика на иконку
// chrome.runtime.onMessage.addListener((message: TMessage) => {
//   if (message.action === ACT.SET_BADGE) {
//     chrome.action.setBadgeText({text: (message.data.words ?? 0).toString()}, () => {
//       chrome.action.setBadgeBackgroundColor({color: "white"}, () => {
//       });
//     });
//   }
// })
