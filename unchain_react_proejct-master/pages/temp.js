import React, {useEffect, useState } from 'react';
import axios from 'axios';

function trade(){
	const [xrpInfo, setXrpInfo] = useState([]);
	// const [상태값 저장 변수, 상태값 갱신 함수 ] = useState(상태 초기값)

	useEffect(() => {
		//Upbit API
		const getApi = async() =>{
			await axios.get('https://api.upbit.com/v1/market/all?isDetails=true').then((res) =>{
			for(let i = 0; i < res.data.length; i++){
				if(res.data[i].market != null){
					setXrpInfo(prev => {return [...prev, res.data[i]]})
				}else{
					alert("error");
				}
			}
			})
			
		}
		getApi();
	}, []) // []를 없애면 렌더링 될 때 마다 실행
	
	return(
		<div>
			<table>
			   <thead>
				   <tr style={{backgroundColor: "black", color: "white"}}>
					   <th scope="col" style={{ textAlign: "center" }}>
					   시장정보
					   </th>
					   <th scope="col" style={{ textAlign: "center" }}>
					   한글명
					   </th>
					   <th scope="col" style={{ textAlign: "center" }}>
					   유의 종목 여부
					   </th>
				   </tr>
			   </thead>
			  
			  {xrpInfo.length > 0 && 
			   <tbody>
				{xrpInfo.map((infor, idx) => {
					return(
					<tr key={idx} style={{backgroundColor: "black", textAlign: "center" ,color: "white"}}>
            			<td>{infor.market}</td>
						<td>{infor.korean_name}</td>
						<td>{infor.market_warning}</td>
					</tr>
					)
			   })
			   }
			   </tbody>
			   }
			   
			</table>
		</div>
	)
}

export default trade;