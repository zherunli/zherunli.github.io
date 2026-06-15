(function () {
  "use strict";

  var reflections = Array.isArray(window.REFLECTIONS) ? window.REFLECTIONS.slice() : [];
  var activeCategory = "全部随笔";
  var activeTag = "";

  var categoryContainer = document.getElementById("category-filters");
  var tagContainer = document.getElementById("tag-filters");
  var list = document.getElementById("reflection-list");
  var emptyState = document.getElementById("reflection-empty");
  var heading = document.getElementById("reflections-heading");
  var description = document.getElementById("filter-description");
  var count = document.getElementById("reflection-count");
  var clearButton = document.getElementById("clear-filters");

  function uniqueValues(values) {
    return values.filter(function (value, index) {
      return values.indexOf(value) === index;
    });
  }

  function createButton(label, className, onClick) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
  }

  function renderFilters() {
    var categories = ["全部随笔"].concat(uniqueValues(reflections.map(function (item) {
      return item.category;
    })));
    var tags = uniqueValues([].concat.apply([], reflections.map(function (item) {
      return item.tags;
    })));

    categoryContainer.textContent = "";
    categories.forEach(function (category) {
      var button = createButton(category, "category-filter", function () {
        activeCategory = category;
        render();
      });
      button.dataset.category = category;
      categoryContainer.appendChild(button);
    });

    tagContainer.textContent = "";
    tags.forEach(function (tag) {
      var button = createButton(tag, "tag-filter", function () {
        activeTag = activeTag === tag ? "" : tag;
        render();
      });
      button.dataset.tag = tag;
      tagContainer.appendChild(button);
    });
  }

  function createArticle(item) {
    var article = document.createElement("article");
    article.className = "reflection-article";
    article.id = item.id;

    var meta = document.createElement("div");
    meta.className = "reflection-meta";

    var category = document.createElement("span");
    category.className = "reflection-category";
    category.textContent = item.category;

    var time = document.createElement("time");
    time.dateTime = item.date;
    time.textContent = item.date;

    meta.appendChild(category);
    meta.appendChild(time);

    var title = document.createElement("h3");
    title.textContent = item.title;
    if (item.sample) {
      var sampleLabel = document.createElement("span");
      sampleLabel.className = "sample-label";
      sampleLabel.textContent = "示例";
      title.appendChild(sampleLabel);
    }

    var body = document.createElement("div");
    body.className = "reflection-body";
    item.paragraphs.forEach(function (paragraph) {
      var text = document.createElement("p");
      text.textContent = paragraph;
      body.appendChild(text);
    });

    var tags = document.createElement("div");
    tags.className = "reflection-tags";
    tags.setAttribute("aria-label", "文章标签");
    item.tags.forEach(function (tag) {
      var tagButton = createButton("# " + tag, "article-tag", function () {
        activeTag = tag;
        render();
        document.querySelector(".reflections-shell").scrollIntoView({ behavior: "smooth" });
      });
      tags.appendChild(tagButton);
    });

    article.appendChild(meta);
    article.appendChild(title);
    article.appendChild(body);
    article.appendChild(tags);
    return article;
  }

  function filteredReflections() {
    return reflections.filter(function (item) {
      var categoryMatches = activeCategory === "全部随笔" || item.category === activeCategory;
      var tagMatches = !activeTag || item.tags.indexOf(activeTag) !== -1;
      return categoryMatches && tagMatches;
    }).sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  function updateFilterStates() {
    document.querySelectorAll(".category-filter").forEach(function (button) {
      var isActive = button.dataset.category === activeCategory;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    document.querySelectorAll(".tag-filter").forEach(function (button) {
      var isActive = button.dataset.tag === activeTag;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function render() {
    var visibleReflections = filteredReflections();
    list.textContent = "";
    visibleReflections.forEach(function (item) {
      list.appendChild(createArticle(item));
    });

    heading.textContent = activeCategory;
    description.textContent = activeTag ? "标签：" + activeTag : "按发布时间从新到旧排列";
    count.textContent = visibleReflections.length + " 篇";
    emptyState.hidden = visibleReflections.length !== 0;
    clearButton.hidden = activeCategory === "全部随笔" && !activeTag;
    updateFilterStates();
  }

  clearButton.addEventListener("click", function () {
    activeCategory = "全部随笔";
    activeTag = "";
    render();
  });

  renderFilters();
  render();
})();
