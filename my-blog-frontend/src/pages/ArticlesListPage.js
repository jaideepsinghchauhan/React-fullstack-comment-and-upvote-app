import articles from "./ArticleContent";
import ArticlesList from '../components/ArticlesList'
const ArticlesListPage = () => {
  return (
    <>
      <h1>Articles</h1>
      {articles.map((article) => (
        <ArticlesList article={article} />
      ))}
    </>
  );
};

export default ArticlesListPage;
