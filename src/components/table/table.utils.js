//метод для проверки возможности ресайза выбранного элемента
export function shouldResize(event) {
    return event.target.dataset.resize
}