import React from "react";
import { useEffect, useState } from "react"

const ListView = () => {
    const [articles, setArticles] = useState(null);

    const apiGet = async (type, param) => {
        const apiUrl = 'https://openapi.naver.com/v1/search/' + type + '?query=' + param;
        const resp = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Naver-Client-Id': "{TWE10XzP970QbnDRqrNs}",
                'X-Naver-Client-Secret': "{zg8kECeTpW}"
            }
        });
        resp.json().then(data => {
            setArticles(data.items);
        })
        .catch(() => console.log('err'));
    };

    useEffect(() => {
        apiGet('news', '코스피');
    }, []);
	
    //ADD :: START
    return (
    	<div className="listArea">
            <ul className="listView">

            </ul>
        </div>
    );
    //ADD :: END
}

export default ListView;