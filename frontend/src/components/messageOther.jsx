/* eslint-disable react/prop-types */


const MessageOther = ({message, toggleTheme}) => {
    return (
        <div className='flex items-center gap-2'>
            <div className=" h-8 w-8 rounded-full border border-[#363636] overflow-hidden">
                <img className=" h-full w-full object-contain" src={message.sender.profileimage} alt="" />
            </div>
            <p className={`${toggleTheme === 'dark'? 'bg-[#262626]': 'bg-[#F1F2F5]'} px-2 py-1 rounded-2xl w-fit flex-wrap break-all`}>{message.message}</p>
        </div>
    );
}

export default MessageOther;
