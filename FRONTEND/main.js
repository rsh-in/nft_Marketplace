
Moralis.initialize("yptq7pcTmSBD9BiKtaqbuL9QkSWE7SyFSfOR3aL9");
Moralis.serverURL = 'https://zzhkwk8hdwbi.bigmoralis.com:2053/server'


init = async() =>{
    hideElement(userInfo); 
    hideElement(createItemForm);
    hideElement(userProfileButton);
    hideElement(openCreateItemButton);
        window.web3 = await Moralis.Web3.enable();      
    initUser();
}

//Loading Page
initUser = async () => {
    if (await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
        showElement(openCreateItemButton);
    }else{
        showElement(userConnectButton);
        hideElement(userProfileButton); 
        hideElement(openCreateItemButton);
    }
}

login = async () => {
    try {
        await Moralis.Web3.authenticate();
        initUser();
    } catch (error) {
        alert(error)
    }
}

logout = async () => {
    await Moralis.User.logOut();
    hideElement(userInfo);
    initUser();
}

openUserInfo = async () => {
    user = await Moralis.User.current();
    if(user){
        const email = user.get('email');
        if(email){
            userEmailField.value = email;
        }else{
            userEmailField.value = "";
        }

        userUsernameField.value = user.get('username');  // Mandatory Field

        const userAvatar = user.get('avatar');
        if(userAvatar){
            userAvatarImage.src = userAvatar.url();
            showElement(userAvatarImage);
        }else{
            hideElement(userAvatarImage);
        }

        showElement(userInfo);
    }else{
        login();
    }
}

saveUserInfo = async () =>{
    user.set('email',userEmailField.value);
    user.set('username',userUsernameField.value);

    if (userAvatarFile.files.length > 0) {
         const avatar = new Moralis.File("Avatar.jpg", userAvatarFile.files[0]);
         user.set('avatar',avatar);
    }

    await user.save();
    alert("User info saved successfully!");
    openUserInfo();

}

createItem = async () => {
    if(createItemFile.files.length == 0){
        alert("Please select a file!");
        return;
    }else if(createItemNameField.value.length == 0){
        alert("Please give the item a name!")
    }
}


hideElement = (element) => element.style.display ="none";
showElement = (element) => element.style.display ="block";
 

// NAVBAR
const userConnectButton = document.getElementById("btnConnect");
userConnectButton.onclick = login;

const userProfileButton = document.getElementById("btnUserInfo");
userProfileButton.onclick = openUserInfo;

const openCreateItemButton = document.getElementById("btnOpenCreateItem");
openCreateItemButton.onclick= () => showElement(createItemForm)


// USER PROFILE
const userInfo = document.getElementById("userInfo");
const userUsernameField = document.getElementById("txtUsername");
const userEmailField = document.getElementById("txtEmail");
const userAvatarImage = document.getElementById("imgAvatar");
const userAvatarFile = document.getElementById("fileAvatar");

document.getElementById("btnCloseUserInfo").onclick = () => hideElement(userInfo);
document.getElementById("btnLogout").onclick = logout;
document.getElementById("btnSaveUserInfo").onclick = saveUserInfo;


// ITEM CREATION
const createItemForm = document.getElementById("createItem");

const createItemNameField = document.getElementById("txtCreateItemName");
const createItemDescriptionField = document.getElementById("txtCreateItemDescription");
const createItemPriceField = document.getElementById("numCreateItemPrice");
const createItemStatusField = document.getElementById("selectCreateItemStatus");
const createItemFileField = document.getElementById("fileCreateItemFile");
document.getElementById("btnCloseCreateItem").onclick = () => hideElement(createItemForm);



init();
