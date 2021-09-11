
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
    if(createItemFileField.files.length == 0){
        alert("Please select a file!");
        return;
    }else if(createItemNameField.value.length == 0){
        alert("Please give the item a name!")
    }

    const nftFile = new Moralis.File("nftFile.jpg",createItemFileField.files[0]);
    await nftFile.saveIPFS();

    const nftFilePath = nftFile.ipfs();
    const nftFileHash = nftFile.hash();

    const metadata = {
        name: createItemNameField.value,
        description: createItemDescriptionField.value,
        nftFilePath : nftFilePath,
        nftFileHash : nftFileHash
    };

    const nftFileMetadateFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
    await nftFileMetadateFile.saveIPFS();

    const nftFileMetadateFilePath = nftFileMetadateFile.ipfs();
    const nftFileMetadateFileHash = nftFileMetadateFile.hash();

    // Simple syntax to create a new subclass of Moralis.Object.
    const Item = Moralis.Object.extend("Item");

    // Create a new instance of that class.
    const item = new Item();
    item.set('name',createItemNameField.value);
    item.set('description',createItemDescriptionField.value);
    item.set('nftFilePath',nftFilePath);
    item.set('nftFileHash',nftFileHash);
    item.set('metadateFilePath',nftFileMetadateFilePath);
    item.set('metadateFileHash',nftFileMetadateFileHash);
    await item.save();
    console.log(item);
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
document.getElementById("btnCreateItem").onclick = createItem;



init();
