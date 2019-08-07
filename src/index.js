import Caver from 'caver-js'
const config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651'
};
const cav = new Caver(config.rpcURL);
const contract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

const App = {
  auth: {
    accessType: 'keystore',
    keystore: '',
    password: ''
  },
  start: async function () {
    // 세션 스토리지에 저장되어 있는 정보 확인
    const walletFromSession = sessionStorage.getItem('walletInstance');
    if (walletFromSession) {
      try {
        // caver wallet 인스턴스에 계정 정보 추가
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
        // 로그인 상태를 보여주기 위해 UI 변경
        this.changeUI(JSON.parse(walletFromSession));
      } catch (e) {
        // 세션 스토리지에 있는 값이 원래의 유효한 값이 아닐 때
        // 세션 스토리지 값 삭제
        sessionStorage.removeItem('walletInstance');
      }
    }

  },
  //키스토어 등록하면 등장하는 녀석
  handleImport: async function () {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = (event) => {
      try {
        if (!this.checkValidKeystore(event.target.result)) {
          $('#message').text(' 유효하지 않은 keystore 파일입니다 .');
          return;
        }
        this.auth.keystore = event.target.result;
        $('#message').text('keystore 통과 , 비밀번호를 입력하세요 .');
        $('#input-password').focus();
      } catch (event) {
        $('#message').text(' 유효하지 않은 keystore 파일입니다 .');
        return;
      }
    }
  },

  handlePassword: async function () {
    this.auth.password = event.target.value;
  },

  handleLogin: async function () {
    // keystore 를 이용한 인증
    if (this.auth.accessType === 'keystore') {
      try {
        // caver 인스턴스의 decrypt 메소드 사용
        // 관련 object 안에는 여러 정보가 있는데 그 중 privateKey 를 가져옴
        const privateKey =
          cav.klay.accounts.decrypt(
            this.auth.keystore, this.auth.password).privateKey;
        // 비밀키를 통해 wallet 인스턴스 생성
        $('#message').text('로그인 성공');
        this.integrateWallet(privateKey);
      } catch (e) {
        $('#message').text(' 비밀번호가 일치하지 않습니다 .');
      }
    } else { // private key 를 이용한 인증
    }
  },

  handleLogout: async function () {
    this.removeWallet();
    location.reload();
  },

 
  getWallet: function () {
    if (cav.klay.accounts.wallet.length) {
      return cav.klay.accounts.wallet[0];
    }
  },

  checkValidKeystore: function (keystore) {
    const parsedKeystore = JSON.parse(keystore);
    const isValidKeystore = parsedKeystore.version &&
      parsedKeystore.id &&
      parsedKeystore.address &&
      parsedKeystore.crypto;
    return isValidKeystore;
  },

  integrateWallet: function (privateKey) {
    // walletInstance 는 로그인 계정의 정보를 가지고 있음
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
    // wallet 에 생성된 인스턴스 추가
    // caver wallet 에 계정을 추가하면
    // 어떤 트랜잭션을 생성 할 때 쉽게 caver 인스턴스를 통해 계정 정보 확인 가능
    cav.klay.accounts.wallet.add(walletInstance);
    // 계정의 로그인 상태를 유지하기 위해 sessionStorage 사용
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance));

    // 로그인 후 UI 변경
    this.changeUI(walletInstance);

  },

  reset: function () {
    this.auth = {
      keystore: '',
      password: ''
    }
  },

  changeUI: async function (walletInstance) {
    $('#loginModal').modal('hide'); // 모달창 닫기
    $('#login').hide(); // 로그인 창 숨기기
    $('#logout').show(); // 로그아웃 창 보이기
    
  },

  removeWallet: function () {
    cav.klay.accounts.wallet.clear();
    sessionStorage.removeItem('walletInstance');
    this.reset();
  },

  getTotalCount : function(){
    var value = contract.methods.getTotalCount().call();
    value.then(num => {
      $('#total_count').text('전체 방문자수 :' + num)
    })
  },


  getMemberInfo : function(){
    var walletInstance = this.getWallet();
    var value = contract.methods.getMemberInfo(walletInstance.address).call();
    value.then( num =>{
      $('#member_info').text('나의 방문 횟수 :' + num)
    } )
  },

  
  visit : function(){
    var walletInstance = this.getWallet();
    contract.methods.visit().send({
      from: walletInstance.address,
      gas : '200000'
    }).then(()=> {
      alert('방문완료');
    })
  },

};

window.App = App;

window.addEventListener("load", function () {
  App.start();
});