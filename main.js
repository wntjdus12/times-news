let newsList = [];
const menus = document.querySelectorAll(".menus button");
const menuList = document.querySelectorAll(".side-menu-list button");
const searchInput = document.getElementById("search-input");



menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)));

menuList.forEach(item => {
    item.addEventListener("click", (event)=>getNewsByCategory(event));
    // item.addEventListener("touchstart", (event)=>getNewsByCategory(event)); // 모바일 대응
});

let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`);
let totalResults = 0;
let page = 1;
let pageSize = 10;
let groupSize = 5;

searchInput.addEventListener("keypress", (event)=> {
    if(event.key ==="Enter") {
        event.preventDefault();
        getNewsByKeyword();
        searchInput.value = "";
    }
})



const getNews = async () => {
    try {
        url.searchParams.set('page', page);
        url.searchParams.set('pageSize', pageSize);

        console.log("Fetching URL:", url.toString()); 

        const response = await fetch(url);

        
        if (!response.ok) {
            throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }

        const data = await response.json();
        console.log("API 응답 데이터:", data); 

        if (!data.articles || data.articles.length === 0) {
            throw new Error("이 검색어의 결과가 없습니다.");
        }

        totalResults = data.totalResults;
        newsList = data.articles;

        console.log("총 뉴스 기사 수:", totalResults);

        render(); 
        paginationRender(); 

    } catch (error) {
        console.error("에러 발생:", error.message);
        errorRender(error.message); 
    }
};


const getLatesNews = async () => {
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`);
    getNews(); 
};

const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase(); 
    console.log("선택된 카테고리:", category);


    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`);
    
    
    getNews();
};


const getNewsByKeyword = async () => {
    const keyword = searchInput.value.trim(); 
    console.log("검색어:", keyword); 

    if (!keyword) {
        errorRender("검색어를 입력해주세요.");
        return;
    }

    
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`);

    getNews(); 
    searchInput.value = "";
};


const render = () => {
    if (newsList.length === 0) {
        errorRender("불러올 뉴스가 없습니다.");
        return;
    }

    const newsHTML = newsList.map(news => `
        <div class="row news">
            <div class="col-lg-4">
                <img class="news-img-size" 
                     src="${news.urlToImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU'}" 
                     onerror="this.onerror=null; this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';" />
            </div>
            <div class="col-lg-8">
                <h2>${news.title}</h2>
                <p>${news.description 
                    ? (news.description.length > 200 
                        ? news.description.substring(0, 200) + '...' 
                        : news.description) 
                    : '내용 없음'}
                </p>
                <p>${news.source?.name || 'No Source'} * ${moment(news.publishedAt).fromNow()}</p>
            </div>
        </div>
    `).join('');

    
    const newsBoard = document.getElementById("news-board");
    if (newsBoard) {
        newsBoard.innerHTML = newsHTML;
    } else {
        console.error("뉴스 게시판 요소가 존재하지 않습니다.");
    }
};


const errorRender = (errorMessage) => {
    const errorHTML = `<div class="alert alert-danger" role="alert">${errorMessage}</div>`;
    document.getElementById("news-board").innerHTML = errorHTML;
};


const paginationRender = () => {
    let paginationHTML = ``;
    const totalPages = Math.ceil(totalResults / pageSize);
    const pageGroup = Math.ceil(page / groupSize);
    let lastPage = pageGroup * groupSize;

    if (lastPage > totalPages) {
        lastPage = totalPages;
    }

    const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

    if (page > 1) {
        paginationHTML = `<li class="page-item" onclick="moveToPage(1)"><a class="page-link" href="#"> &lt;&lt; </a></li>
            <li class="page-item" onclick="moveToPage(${page - 1})"><a class="page-link" href="#">&lt;</a></li>`;
    }

    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML += `<li class="page-item ${i === page ? "active" : ''}" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`;
    }

    if (page < totalPages) {
        paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})"><a class="page-link" href="#"> &gt; </a></li>
            <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link" href="#"> &gt;&gt; </a></li>`;
    }

    document.querySelector(".pagination").innerHTML = paginationHTML;
};


const moveToPage = (pageNum) => {
    page = pageNum;
    getNews();
};


const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    inputArea.style.display = inputArea.style.display === "inline" ? "none" : "inline";
    searchInput.focus();
};


const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
};


const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0px";
};


getLatesNews();
