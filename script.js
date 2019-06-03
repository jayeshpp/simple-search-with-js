
var Search = (()=>{

    var searchInput = document.getElementById("search");
    var inputValue = "";
    var dataURL = "./data.json";

    var handleSearch = async (event) => {
        inputValue = event.target.value;
        var data = await readJSON();
        var filteredData = filterData(data);
        renderUI(filteredData);
    }

    var readJSON = async () => {
        var data = await fetch(dataURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(json => {
                return json
            })
            .catch((e) => {
                return new Error(e);
            })
        return data;
    }

    var filterData = (data) => {
        return data.filter(element => matchString(element.id) || matchString(element.name) || matchString(element.address));
    }

    var matchString = (string) => {
        if(inputValue.length === 0) return false;
        return string.toLowerCase().match(inputValue.toLowerCase());
    }

    var handleEvents = (event) => {
        searchInput.addEventListener("input", debounce(handleSearch, 500));
        document.addEventListener("mouseover", function(event) {
            if(event.target && event.target.parentElement && event.target.parentElement.tagName === "LI" && inputValue.length > 0) {
                highlightContent(event.target.parentElement);
            }
        });
        document.addEventListener("keydown", handleKeyboardAction);
    }

    var handleKeyboardAction = (event) => {
        var hlElement = document.querySelector("li.highlight");
        var resulitList = Array.prototype.slice.call(document.querySelectorAll("li"));
        var hlElementIndex = resulitList.indexOf(hlElement);
        var element = hlElement;
        var index = 0;

        /* 
        var scrollContainer = document.querySelector(".search-result");
        var _scrollHeight = scrollContainer.scrollHeight;
        var _scrollTop = scrollContainer.scrollTop;
        var _offsetHeight = scrollContainer.offsetHeight;
        var _isAtTheEnd = false;
        var _isAtTheTop = true;

        if((_scrollTop + _offsetHeight) == _scrollHeight) {
            _isAtTheTop = false;
            _isAtTheEnd = true;
        }
        if(_scrollTop == 0) {
            _isAtTheTop = true;
            _isAtTheEnd = false;
        } */

        if(event.which === 38) {
            index = hlElementIndex - 1;
        }else if(event.which === 40) {
            index = hlElementIndex += 1;
        }

        element = resulitList[index];
        if(element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest"
            });
        }
        highlightContent(element);
    }

    var highlightContent = (element) => {
        if(element) {
            siblings(element).map(item => item.classList.remove("highlight"));
            element.classList.add("highlight");
        }
    }

    var highlightString = (text) => {
         return text.replace(inputValue,"<span class='highlight'>"+inputValue+"</span>")
    }

    var siblings = (elem) => {
        let siblings = [];
        let sibling = elem.parentNode.firstChild;
    
        for (; sibling; sibling = sibling.nextSibling)
            if (sibling.nodeType == 1 && sibling != elem)
                siblings.push(sibling);
        return siblings;
    }

    var renderUI = (data) => {
        var html;
        var placeholder = document.querySelector(".search-result");
        if(data.length > 0) {
            html = `<ul>
                    ${
                        data.map((element, index) => 
                            `<li ${index === 0 ? 'class="highlight"' : ''}>
                                <span class="id">${highlightString(element.id)}</span>
                                <span class="name">${highlightString(element.name)}</span>
                                <span class="address">${highlightString(element.address)}</span>
                            </li>`
                        ).join('')
                    }
                </ul>`;
        }else if(data.length === 0 && inputValue.length > 0) {
            html = `<div class='no-result-found'>No result found</div>`;
        }else {
            html = ``;
        }
        placeholder.innerHTML = html;
    }

    const debounce = (func, delay) => {
        let inDebounce
        return function() {
          const context = this
          const args = arguments
          clearTimeout(inDebounce)
          inDebounce = setTimeout(() => func.apply(context, args), delay)
        }
    }

    var init = () => {
        handleEvents();
    }
    
    return {
        init: init
    }
})();


window.onload = Search.init();
