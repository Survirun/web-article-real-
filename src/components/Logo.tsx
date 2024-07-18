interface LogoInterface {
    type?: 'light' | 'dark'
  }
  
  export const Logo = ({type = 'dark'}: LogoInterface) => {
    const lightColor = "#FFFFFF"; 
    const darkColor = "#18171D"; 
    const color = (type === 'light') ? lightColor : darkColor;
    return (
      <div className="flex justify-center gap-[0.4rem]">
        <svg xmlns="http://www.w3.org/2000/svg" width="62" height="26" viewBox="0 0 62 26" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.7273 0.272461H10.1818V10.4543H7.63636V7.90882H2.54545V10.4543H0V15.5452H2.54545V18.0906H7.63636V15.5452H10.1818V18.0906H12.7273V15.5452H10.1818V10.4543H12.7273V0.272461ZM7.63636 15.5452H2.54545V10.4543H7.63636V15.5452Z" fill={color}/>
        <path d="M34.5227 25.727H31.9773V15.5452H34.5227V25.727Z" fill={color}/>
        <path fillRule="evenodd" clipRule="evenodd" d="M34.5227 10.4543V15.5452H37.0682V18.0906H42.1591V15.5452H44.7046V10.4543H42.1591V7.90882H37.0682V10.4543H34.5227ZM37.0682 10.4543H42.1591V15.5452H37.0682V10.4543Z" fill={color}/>
        <path d="M34.5227 10.4543V7.90882H31.9773V10.4543H34.5227Z" fill={color}/>
        <path d="M29.4318 0.272461H26.8864V18.0906H29.4318V0.272461Z" fill={color}/>
        <path d="M46.6136 0.272461H49.1591V12.9997H46.6136V0.272461Z" fill={color}/>
        <path d="M49.1591 15.5452H46.6136V18.0906H49.1591V15.5452Z" fill={color}/>
        <path d="M53.4546 10.4543V7.90882L61.0909 7.90883V18.0906H58.5455L58.5455 10.4543L53.4546 10.4543Z" fill={color}/>
        <path d="M53.4546 10.4543V18.0906H50.9091L50.9091 10.4543H53.4546Z" fill={color}/>
        <path d="M20.8409 7.74973H18.6136L18.8331 11.2619L15.9091 9.32085L14.7954 11.2497L17.9432 12.8139L14.7277 14.4118L15.8413 16.3406L18.8373 14.3519L18.6136 17.9316H20.8409L20.6171 14.3519L23.6132 16.3406L24.7268 14.4118L21.5113 12.8139L24.6591 11.2497L23.5454 9.32085L20.6213 11.2619L20.8409 7.74973Z" fill={color}/>
        </svg>
      </div>
    );
  };