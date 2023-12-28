const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function addBook() {
    const textTitle = document.getElementById('title').value;
    const textAuthor = document.getElementById('author').value;
    const numberYearString = document.getElementById('year').value;


    const numberYear = +numberYearString;
    const isCompleteCheckbox = document.getElementById('Complete');
    const isComplete = isCompleteCheckbox.checked;


    const generatedID = generateId();

    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, numberYear, isComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();


}

function generateId() {
    return +new Date();
  }

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}


function makeBook(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;
   
    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Author : ${bookObject.author}`;

    const numberYear = document.createElement('p');
    numberYear.innerText = `Tahun Terbit : ${bookObject.year}`; 
   
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, numberYear); 
   
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`); 
   
    if(bookObject.isComplete) { 
        const undoButton = document.createElement("button");
        undoButton.classList.add('undo-button');
        undoButton.innerText = 'Belum Selesai Dibaca';

        undoButton.addEventListener('click', function() {
            undoBookFromComplete(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');  
        trashButton.innerText = 'Hapus Buku';

        trashButton.addEventListener('click', function(){
            removeBookFromComplete(bookObject.id); 
        });

        container.append(undoButton, trashButton);
    } else {

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');  
        trashButton.innerText = 'Hapus Buku';

        trashButton.addEventListener('click', function(){
            removeBookFromComplete(bookObject.id);
        });

        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.innerText = 'Selesai Dibaca'

        checkButton.addEventListener('click', function() {
            addBookToComplete(bookObject.id); 
        });
        container.append(checkButton, trashButton);
    }

    return container;
}


    function addBookToComplete (bookid) {
        const bookTarget = findBook(bookid);

        if (bookTarget == null) return;

        bookTarget.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function removeBookFromComplete(bookId) {
        const bookTargetIndex = findBookIndex(bookId);
    
        if (bookTargetIndex === -1) return;
    
        const confirmDelete = window.confirm("Are you sure you want to delete this book?");
        
        if (confirmDelete) {
            books.splice(bookTargetIndex, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        }
    }
    function undoBookFromComplete(bookId) {
        const bookTarget = findBook(bookId);
       
        if (bookTarget == null) return;
       
        bookTarget.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
                saveData();
    }

    function findBook(bookId) {
        for(const bookItem of books){
            if (bookItem.id === bookId){
                return bookItem;
            }
        }
        return null;
    }

    function findBookIndex(bookid){
        for(const index in books) {
            if(books[index].id === bookid){
                return index;
            }
        }
        return -1;
    }

    //Search Function
    function filterBook()   {
        const searchQuery = document.getElementById('search').value.toLowerCase();
        const filteredBook = books.filter(book => book.title.toLowerCase().includes(searchQuery));

        renderFilteredBooks(filteredBook);
    }

    function renderFilteredBooks(filteredBook){
        const uncompleteBookList = document.getElementById('books');
        uncompleteBookList.innerHTML = '';

        const completeBookList = document.getElementById('complete-books');
        completeBookList.innerHTML = '';

        for(const bookItem of filteredBook) {
            const bookElement = makeBook(bookItem);

            if(!bookItem.isComplete)
            uncompleteBookList.append(bookElement);
            else            
            completeBookList.append(bookElement);
        }


    }

    //End Search Function

    function saveData() {
        if(isStorageExist()){
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY,parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    
    }

    function localDataFromStorage() {
        const serializedDate = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedDate);

        if(data !== null ){
            for(const book of data){
                books.push(book);
            }
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function isStorageExist() /* boolean */ {
        if (typeof (Storage) === undefined) {
          alert('Browser kamu tidak mendukung local storage');
          return false;
        }
        return true;
      }

    document.addEventListener('DOMContentLoaded', function () {
        
        const submitForm = document.getElementById('form'); 

        submitForm.addEventListener('submit', function (event) {
        event.preventDefault();

            addBook();

        });

        if(isStorageExist()){
            localDataFromStorage();
        }
    });

    document.addEventListener(RENDER_EVENT, function () {

        const uncompleteBookList = document.getElementById('books') 
        uncompleteBookList.innerHTML = '';

        const completeBookList = document.getElementById('complete-books')
        completeBookList.innerHTML = '';

        for (const bookItem of books) { 
            console.log(typeof bookItem);
            const bookElement = makeBook(bookItem);
            if (!bookItem.isComplete)
            uncompleteBookList.append(bookElement);
            else
            completeBookList.append(bookElement);
        }   
    });

    document.addEventListener(SAVED_EVENT, function(){
        console.log(localStorage.getItem(STORAGE_KEY));
    });
