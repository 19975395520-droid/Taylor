const suggestions = [
  '设计一个安静的阅读空间，让文字成为主角。',
  '为你最喜欢的咖啡店设计一张有温度的首页。',
  '用一种主色和大量留白，展示你最近的三个作品。',
  '做一个旅行灵感收藏页，记录下一次想去的地方。',
  '为每天的小目标设计一个简洁的打卡界面。',
];

let suggestionIndex = 0;
document.querySelector('#shuffle').addEventListener('click', () => {
  suggestionIndex = (suggestionIndex + 1) % suggestions.length;
  document.querySelector('#suggestion').textContent = suggestions[suggestionIndex];
});
