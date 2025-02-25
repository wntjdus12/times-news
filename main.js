let news =[];

const getLatestNews = async ()=> {
    const url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
      );
      const response = await fetch(url);
      const data = await response.json();
      news = data.articles;
      console.log("dd", news);
}

getLatestNews()