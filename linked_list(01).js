// Определяем класс Node для узлов списка
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// Определяем класс LinkedList для списка
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Метод добавления элемента в конец списка
  add(value) {
    const node = new Node(value);

    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.size++;
  }

  // Метод удаления дубликатов из списка
  removeDuplicates() {
    let current = this.head;
    let previous = null;
    let values = {};

    while (current) {
      if (values[current.value]) {
        previous.next = current.next;
        this.size--;
      } else {
        values[current.value] = true;
        previous = current;
      }
      current = current.next;
    }
  }

  // Метод вывода списка в консоль
  print() {
    let current = this.head;
    while (current) {
      console.log(current.value);
      current = current.next;
    }
  }
}

// Создаем новый список и добавляем в него значения
const list = new LinkedList();
list.add(4);
list.add(2);
list.add(3);
list.add(4);
list.add(3);
list.add(6);

// Удаляем дубликаты из списка и выводим его в консоль
list.removeDuplicates();
list.print();
