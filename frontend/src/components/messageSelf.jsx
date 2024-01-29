/* eslint-disable react/prop-types */


const MessageSelf = ({message, toggleTheme}) => {
    return (
        <div className='bg-[#3697F0]  w-fit px-2 py-1 rounded-2xl self-end '>
            <p className={`${toggleTheme === 'dark'? '': 'text-white'} flex-wrap break-all`}>{message.message}</p>
        </div>
    );
}

export default MessageSelf;
