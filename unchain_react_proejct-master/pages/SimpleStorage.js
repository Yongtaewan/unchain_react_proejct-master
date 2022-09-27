import React, {useState} from 'react'
import {ethers} from 'ethers'
import SimpleStorage_abi from './SimpleStorage_abi.json'
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import { Container } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import Form from "react-bootstrap/Form"; 
import Head from 'next/head';
import Card from 'react-bootstrap/Card';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';

const DisplayBoard = styled.main`
  width: 1250px;
  height : 1000px;
  margin: 0 auto;
  display: grid;
  background-color: whitesmoke;

  font-family: Arial, Helvetica, sans-serif;

  *::-webkit-scrollbar,
  *::-webkit-scrollbar-thumb {
    width: 0px;
  }

  *::-webkit-scrollbar-thumb {
  }
  *:hover::-webkit-scrollbar,
  *:hover::-webkit-scrollbar-thumb {
    width: 26px;
    border-radius: 13px;
    background-clip: padding-box;
    border: 12px solid transparent;
    color: grey;
  }

  *:hover::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 0 10px;
  }

  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`
const FormContainer = styled.div`
  display : grid;
  height : 330px;
  grid-template-columns: 1fr 1fr;
  border : 1px solid black;
  align-items: center;
  justify-content: center;
  text-align : center;
`

const FormContainer_ele1 = styled.div`
  border : 1px solid black;
  height : 100%;
  padding-top : 10px;
`

const FormContainer_ele2 = styled.div`
  border : 1px solid black;
  height: 100%;
`

const DetailLayout = styled.div`
  height: 700px;
  width: 1250px;
  background-color: whitesmoke;
  display: grid;
  gap: 5px;
  grid-template-columns: 1fr 1fr 1fr;
  border : 1px solid black;
  align-items: center;
  justify-content: center;
  padding-left: 90px;
  top : 50%;
  left : 50%;
  overflow : scroll;
`

const TraderListTitle = styled.div`
  height : 60px;
  margin-top : 10px;
  align-items: center;
  font-size: 2rem;
  text-align : center;
`


const SimpleStorage = () => {

	//let contractAddress = '0xd64Dc175606fAe83F9412b44298CC1632A6Fc979';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('2. Connect Wallet');

	const [contractAddress, setContractAddress] = useState(null);

	const [currentContractVal, setCurrentContractVal] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const [show, setShow] = useState(true);

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('2. Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, SimpleStorage_abi, tempSigner);
		setContract(tempContract);	
	}

	const setHandler = (event) => {
		event.preventDefault();
		//console.log('sending ' + event.target.setText.value + ' to the contract');
		contract.set(event.target.setText.value);
		setCurrentContractVal(event.target.setText.value);
	}

	const setAddressHandler = (event) => {
		event.preventDefault();
		setContractAddress(event.target.setText.value);
	}

	const getCurrentVal = async () => {
		let val = await contract.get();
		setCurrentContractVal(val);
	}

	const handleCopyClipBoard = async(text) => {
		try {
			await navigator.clipboard.writeText(text);
			alert('주소 복사 완료');
		}catch(error){
			alert('복사 실패');
		}
	};

	const notYet = async() => {
		try {
			alert('준비중입니다.');
		}catch(error){
			alert('에러발생');
		}
	};
	
	return (
		<>
		<Head><title>TDC 거래 | 언체인</title></Head>

		<Alert id="head_alert" show={show} variant="success">
        <Alert.Heading>거래 순서 안내</Alert.Heading>
        <p>
			1.아래의 리스트에서 TDC를 전달하고자 하는 사람의 지갑 주소를 복사하고 set Address를 클릭합니다.<br/>
			2.이후 Connect Wallet을 통해 자신의 Metamask를 연결합니다.<br/>
			3.마지막으로 Contract할 내용을 작성하여 Update Contract를 진행합니다!<br/>
			※ 반드시 set Address를 진행한 이후 Connect Wallet을 진행해주세요.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
            알겠습니다!
          </Button>
        </div>
      </Alert>

		<DisplayBoard>
			<FormContainer>
				<FormContainer_ele1>
				<form onSubmit={setAddressHandler}>
				<Form.Text className="text-muted">
					보낼 트레이더의 지갑 주소를 입력해주세요.
				</Form.Text><br/>
					<input id="setText" type="text"/><br/>
				
					<button type={"submit"}>1. set Address </button><br/>
					
				</form>
				<div className = "bg-light border"> 받을 주소 : {contractAddress} </div>
				<br/>
				
				<Form.Text className="text-muted">
					set Address를 진행한 이후 눌러주세요.
				</Form.Text><br/>
				<button onClick={connectWalletHandler}>{connButtonText}</button>
				<br/>
				<div className = "bg-light border"> 내 주소 : {defaultAccount}
				</div>
				<br/>

				<div className = "bg-light border">
				</div>

				<form onSubmit={setHandler}>
					<input id="setText" type="text"/><br/>
					<button type={"submit"}> 3. Update Contract </button>
				</form>

				{errorMessage}
				</FormContainer_ele1>
				<FormContainer_ele2>
					{<Button onClick={() => setShow(true)}>사용법 펼치기</Button>}
				</FormContainer_ele2>
			</FormContainer>
			<TraderListTitle>상위 트레이더 리스트</TraderListTitle>
		<DetailLayout>

			<Card style={{ width : '18rem'}}>
				<Card.Img variant = "top" src = "profile_img1.jpg"/>
				<Card.Body>
					<Card.Title>James</Card.Title>
					<Card.Text>완벽한 기법과 지표는 없습니다.</Card.Text>
				</Card.Body>
				<ListGroup className="list-group-flush">
					<ListGroup.Item>총 수익 : 171,845,174₩</ListGroup.Item>
					<ListGroup.Item>거래 수량 : 174건</ListGroup.Item>
					<ListGroup.Item>팔로워 수 : 21명</ListGroup.Item>
					<button onClick={() => handleCopyClipBoard('0xd64Dc175606fAe83F9412b44298CC1632A6Fc979')}>
						지갑 주소 복사
					</button>
				</ListGroup>
			</Card>

			<Card style={{ width : '18rem'}}>
				<Card.Img variant = "top" src = "profile_img2.jpg"/>
				<Card.Body>
					<Card.Title>kalnal</Card.Title>
					<Card.Text>시장 추세를 활용한 트레이딩</Card.Text>
				</Card.Body>
				<ListGroup className="list-group-flush">
					<ListGroup.Item>총 수익 : 150,845,174₩</ListGroup.Item>
					<ListGroup.Item>거래 수량 : 147건</ListGroup.Item>
					<ListGroup.Item>팔로워 수 : 121명</ListGroup.Item>
					<button onClick={() => handleCopyClipBoard('0xd64Dc175606fAe83F9412b44298CC1632A6Fc979')}>
						지갑 주소 복사
					</button>
				</ListGroup>
			</Card>

			<Card style={{ width : '18rem'}}>
				<Card.Img variant = "top" src = "profile_img4.jpg"/>
				<Card.Body>
					<Card.Title>Cjungtur</Card.Title>
					<Card.Text>안정성을 추구합니다.</Card.Text>
				</Card.Body>
				<ListGroup className="list-group-flush">
					<ListGroup.Item>총 수익 : 78,845,174₩</ListGroup.Item>
					<ListGroup.Item>거래 수량 : 1544건</ListGroup.Item>
					<ListGroup.Item>팔로워 수 : 51명</ListGroup.Item>
					<button onClick={() => handleCopyClipBoard('0xd64Dc175606fAe83F9412b44298CC1632A6Fc979')}>
						지갑 주소 복사
					</button>
				</ListGroup>
			</Card>
			
			<Card style={{ width : '18rem'}}>
				<Card.Img variant = "top" src = "profile_img3.jpg"/>
				<Card.Body>
					<Card.Title>Dopamine</Card.Title>
					<Card.Text>준비중입니다.</Card.Text>
				</Card.Body>
				<ListGroup className="list-group-flush">
					<ListGroup.Item>총 수익 : </ListGroup.Item>
					<ListGroup.Item>거래 수량 : </ListGroup.Item>
					<ListGroup.Item>팔로워 수 : </ListGroup.Item>
					<button onClick={() => notYet()}>
						지갑 주소 복사
					</button>
				</ListGroup>
			</Card>

			<Card style={{ width : '18rem'}}>
				<Card.Img variant = "top" src = "profile_img3.jpg"/>
				<Card.Body>
					<Card.Title>Germanium</Card.Title>
					<Card.Text>준비중입니다.</Card.Text>
				</Card.Body>
				<ListGroup className="list-group-flush">
					<ListGroup.Item>총 수익 : </ListGroup.Item>
					<ListGroup.Item>거래 수량 : </ListGroup.Item>
					<ListGroup.Item>팔로워 수 : </ListGroup.Item>
					<button onClick={() => notYet()}>
						지갑 주소 복사
					</button>
				</ListGroup>
			</Card>
			
			<Card style={{ width : '18rem'}}>
				<Card.Img variant = "top" src = "profile_img3.jpg"/>
				<Card.Body>
					<Card.Title>Iodin</Card.Title>
					<Card.Text>준비중입니다.</Card.Text>
				</Card.Body>
				<ListGroup className="list-group-flush">
					<ListGroup.Item>총 수익 : </ListGroup.Item>
					<ListGroup.Item>거래 수량 : </ListGroup.Item>
					<ListGroup.Item>팔로워 수 : </ListGroup.Item>
					<button onClick={() => notYet()}>
						지갑 주소 복사
					</button>
				</ListGroup>
			</Card>
			
			<Card style={{ width : '18rem'}}>
				<Card.Img variant = "top" src = "profile_img3.jpg"/>
				<Card.Body>
					<Card.Title>Oxygen</Card.Title>
					<Card.Text>준비중입니다.</Card.Text>
				</Card.Body>
				<ListGroup className="list-group-flush">
					<ListGroup.Item>총 수익 : </ListGroup.Item>
					<ListGroup.Item>거래 수량 : </ListGroup.Item>
					<ListGroup.Item>팔로워 수 : </ListGroup.Item>
					<button onClick={() => notYet()}>
						지갑 주소 복사
					</button>
				</ListGroup>
			</Card>
		</DetailLayout>
		</DisplayBoard>
		
        <style jsx>{`
			#head_alert{
				white-space : pre-line;	
			}
		`}</style>
		</>
	);
}

export default SimpleStorage;