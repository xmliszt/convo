'use client';

import anime from 'animejs';
import { useEffect } from 'react';

export function ConvoLoader() {
  useEffect(() => {
    anime({
      targets: '#convo-logo-svg-stroke path',
      strokeDashoffset: [0, anime.setDashoffset],
      easing: 'easeInOutSine',
      duration: 1000,
      delay: function (el, i) {
        return i * 500;
      },
      direction: 'reverse',
      loop: true,
    });
  }, []);

  return (
    <div className='relative h-[53px] w-[265px]'>
      <svg
        id='convo-logo-svg-stroke'
        width='100%'
        height='100%'
        viewBox='0 0 117 32'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M114.25 26.1526L114.252 26.1495C115.128 24.4533 115.548 22.2454 115.548 19.56C115.548 16.8746 115.128 14.6668 114.252 12.9705C113.381 11.2855 112.161 10.0433 110.588 9.27118C109.041 8.51167 107.256 8.14001 105.248 8.14001C103.29 8.14001 101.52 8.51263 99.9504 9.26963L99.9503 9.26962L99.9472 9.27118C98.376 10.0425 97.1434 11.2828 96.2463 12.9647L96.2463 12.9647L96.2433 12.9705C95.3669 14.6668 94.9475 16.8746 94.9475 19.56C94.9475 22.2454 95.3669 24.4533 96.2433 26.1495L96.2432 26.1496L96.248 26.1584C97.1458 27.8138 98.3785 29.0388 99.9472 29.8089L99.9504 29.8104C101.52 30.5674 103.29 30.94 105.248 30.94C107.256 30.94 109.041 30.5684 110.588 29.8088C112.158 29.038 113.379 27.8111 114.25 26.1526ZM103.022 12.0481L103.022 12.0481L103.023 12.0452C103.72 10.4982 104.486 9.94001 105.248 9.94001C106.036 9.94001 106.802 10.5003 107.469 12.0388L107.469 12.0389L107.473 12.0481C108.145 13.5174 108.508 15.998 108.508 19.56C108.508 23.122 108.145 25.6026 107.473 27.072L107.473 27.0719L107.47 27.0784C106.805 28.5866 106.041 29.14 105.248 29.14C104.482 29.14 103.716 28.5887 103.022 27.072C102.35 25.6026 101.988 23.122 101.988 19.56C101.988 15.998 102.35 13.5174 103.022 12.0481Z'
          stroke='hsl(var(--primary))'
        />
        <path
          d='M95.021 8.66007L94.4826 8.70148C94.1435 8.72757 93.6827 8.75396 93.0983 8.78053L93.121 9.28001L93.0983 8.78053C92.5184 8.80688 91.966 8.82001 91.441 8.82001H91.4389H91.4369H91.4349H91.4328H91.4308H91.4288H91.4267H91.4247H91.4226H91.4206H91.4186H91.4165H91.4145H91.4124H91.4104H91.4083H91.4063H91.4042H91.4022H91.4001H91.3981H91.396H91.3939H91.3919H91.3898H91.3878H91.3857H91.3836H91.3816H91.3795H91.3774H91.3754H91.3733H91.3712H91.3691H91.3671H91.365H91.3629H91.3608H91.3588H91.3567H91.3546H91.3525H91.3504H91.3483H91.3463H91.3442H91.3421H91.34H91.3379H91.3358H91.3337H91.3316H91.3295H91.3274H91.3253H91.3232H91.3211H91.319H91.3169H91.3148H91.3127H91.3106H91.3085H91.3064H91.3043H91.3021H91.3H91.2979H91.2958H91.2937H91.2916H91.2894H91.2873H91.2852H91.2831H91.281H91.2788H91.2767H91.2746H91.2724H91.2703H91.2682H91.266H91.2639H91.2618H91.2596H91.2575H91.2554H91.2532H91.2511H91.2489H91.2468H91.2446H91.2425H91.2404H91.2382H91.2361H91.2339H91.2318H91.2296H91.2274H91.2253H91.2231H91.221H91.2188H91.2166H91.2145H91.2123H91.2102H91.208H91.2058H91.2037H91.2015H91.1993H91.1971H91.195H91.1928H91.1906H91.1884H91.1863H91.1841H91.1819H91.1797H91.1775H91.1754H91.1732H91.171H91.1688H91.1666H91.1644H91.1622H91.16H91.1578H91.1556H91.1534H91.1512H91.149H91.1468H91.1446H91.1424H91.1402H91.138H91.1358H91.1336H91.1314H91.1292H91.127H91.1248H91.1226H91.1203H91.1181H91.1159H91.1137H91.1115H91.1093H91.107H91.1048H91.1026H91.1004H91.0981H91.0959H91.0937H91.0914H91.0892H91.087H91.0847H91.0825H91.0803H91.078H91.0758H91.0735H91.0713H91.0691H91.0668H91.0646H91.0623H91.0601H91.0578H91.0556H91.0533H91.0511H91.0488H91.0466H91.0443H91.0421H91.0398H91.0375H91.0353H91.033H91.0307H91.0285H91.0262H91.0239H91.0217H91.0194H91.0171H91.0149H91.0126H91.0103H91.008H91.0058H91.0035H91.0012H90.9989H90.9966H90.9944H90.9921H90.9898H90.9875H90.9852H90.9829H90.9806H90.9783H90.976H90.9738H90.9715H90.9692H90.9669H90.9646H90.9623H90.96H90.9577H90.9554H90.9531H90.9507H90.9484H90.9461H90.9438H90.9415H90.9392H90.9369H90.9346H90.9322H90.9299H90.9276H90.9253H90.923H90.9206H90.9183H90.916H90.9137H90.9113H90.909H90.9067H90.9044H90.902H90.8997H90.8974H90.895H90.8927H90.8903H90.888H90.8857H90.8833H90.881H90.8786H90.8763H90.8739H90.8716H90.8692H90.8669H90.8645H90.8622H90.8598H90.8575H90.8551H90.8528H90.8504H90.848H90.8457H90.8433H90.841H90.8386H90.8362H90.8339H90.8315H90.8291H90.8268H90.8244H90.822H90.8196H90.8173H90.8149H90.8125H90.8101H90.8077H90.8054H90.803H90.8006H90.7982H90.7958H90.7934H90.791H90.7886H90.7863H90.7839H90.7815H90.7791H90.7767H90.7743H90.7719H90.7695H90.7671H90.7647H90.7623H90.7599H90.7575H90.755H90.7526H90.7502H90.7478H90.7454H90.743H90.7406H90.7382H90.7357H90.7333H90.7309H90.7285H90.7261H90.7236H90.7212H90.7188H90.7164H90.7139H90.7115H90.7091H90.7066H90.7042H90.7018H90.6993H90.6969H90.6945H90.692H90.6896H90.6871H90.6847H90.6822H90.6798H90.6774H90.6749H90.6725H90.67H90.6676H90.6651H90.6626H90.6602H90.6577H90.6553H90.6528H90.6504H90.6479H90.6454H90.643H90.6405H90.638H90.6356H90.6331H90.6306H90.6282H90.6257H90.6232H90.6207H90.6183H90.6158H90.6133H90.6108H90.6083H90.6059H90.6034H90.6009H90.5984H90.5959H90.5934H90.5909H90.5885H90.586H90.5835H90.581H90.5785H90.576H90.5735H90.571H90.5685H90.566H90.5635H90.561H90.5585H90.556H90.5535H90.5509H90.5484H90.5459H90.5434H90.5409H90.5384H90.5359H90.5333H90.5308H90.5283H90.5258H90.5233H90.5207H90.5182H90.5157H90.5132H90.5106H90.5081H90.5056H90.503H90.5005H90.498H90.4954H90.4929H90.4904H90.4878H90.4853H90.4827H90.4802H90.4776H90.4751H90.4726H90.47H90.4675H90.4649H90.4624H90.4598H90.4572H90.4547H90.4521H90.4496H90.447H90.4445H90.4419H90.4393H90.4368H90.4342H90.4316H90.4291H90.4265H90.4239H90.4214H90.4188H90.4162H90.4136H90.4111H90.4085H90.4059H90.4033H90.4007H90.3982H90.3956H90.393H90.3904H90.3878H90.3852H90.3826H90.38H90.3775H90.3749H90.3723H90.3697H90.3671H90.3645H90.3619H90.3593H90.3567H90.3541H90.3515H90.3489H90.3463H90.3436H90.341H90.3384H90.3358H90.3332H90.3306H90.328H90.3254H90.3227H90.3201H90.3175H90.3149H90.3123H90.3096H90.307H90.3044H90.3018H90.2991H90.2965H90.2939H90.2912H90.2886H90.286H90.2833H90.2807H90.278H90.2754H90.2728H90.2701H90.2675H90.2648H90.2622H90.2595H90.2569H90.2565C89.8273 8.79355 89.3737 8.78028 88.8958 8.78001C88.449 8.7537 88.0285 8.7274 87.6342 8.70112L87.101 8.66557V9.20001V10V10.4697L87.5698 10.499C88.3334 10.5468 88.8934 10.7806 89.2971 11.163L89.3023 11.1679L89.3076 11.1726C89.6883 11.5133 89.9495 12.0678 90.0228 12.9227L90.0229 12.924C90.0938 13.7268 89.9064 14.8208 89.41 16.2322L87.0091 22.8877L82.9162 12.0431C82.8191 11.6996 82.7708 11.4291 82.7603 11.2244C82.7493 11.0094 82.7823 10.9117 82.7999 10.8794C82.8612 10.7671 82.9848 10.6563 83.3013 10.6164C83.731 10.5659 84.2171 10.54 84.761 10.54H85.261V10.04V9.20001V8.66557L84.7277 8.70112C83.9315 8.7542 83.0687 8.8073 82.1394 8.86043C81.2396 8.88683 80.3802 8.90001 79.561 8.90001C78.4746 8.90001 77.4686 8.8868 76.5428 8.86043C75.6394 8.80728 74.7625 8.75413 73.9122 8.70099L73.381 8.66779V9.20001V10.04V10.54H73.881C74.0451 10.54 74.2998 10.6104 74.6637 10.8288L74.6802 10.8386L74.6974 10.8472C74.8021 10.8996 74.9569 11.0311 75.1477 11.3114C75.3343 11.5856 75.5322 11.9674 75.7378 12.4683C75.738 12.4688 75.7382 12.4693 75.7384 12.4698L82.8572 30.1468L82.992 30.4816L83.3522 30.459C83.7685 30.433 84.1847 30.42 84.601 30.42C85.0445 30.42 85.4741 30.4331 85.8898 30.459L86.2666 30.4826L86.3924 30.1267L92.2309 13.6109C92.2311 13.6102 92.2314 13.6095 92.2317 13.6088C92.6518 12.4538 93.0634 11.7068 93.4445 11.3033L93.4446 11.3034L93.4536 11.2934C93.8608 10.8383 94.2608 10.5855 94.6482 10.4835L95.021 10.3855V10V9.20001V8.66007Z'
          stroke='hsl(var(--primary))'
        />
        <path
          d='M61.8809 9.03073C61.1086 9.40793 60.4426 9.94704 59.8804 10.6379V8.76002V8.13453L59.2702 8.2723C58.4667 8.45374 57.5812 8.59736 56.6127 8.70225C55.6702 8.7806 54.6463 8.82002 53.5404 8.82002C52.757 8.82002 51.9459 8.78085 51.107 8.7022L50.5604 8.65095V9.20002V10.04V10.54H51.0604C51.9572 10.54 52.41 10.8023 52.6299 11.1744L52.6368 11.1861L52.6443 11.1974C52.9347 11.6329 53.1204 12.3913 53.1204 13.56V26.16C53.1204 27.2607 52.9155 27.8378 52.6668 28.0865L52.6607 28.0926L52.6548 28.0989C52.4247 28.3455 51.9476 28.54 51.0604 28.54H50.5604V29.04V29.88V30.4056L51.0853 30.3794C51.6122 30.353 52.4071 30.3265 53.4729 30.2999L53.4729 30.3L53.4853 30.2994C54.5441 30.2465 55.5758 30.22 56.5804 30.22C57.5581 30.22 58.4949 30.2464 59.391 30.2992L59.3985 30.2996L59.4061 30.2998C60.3383 30.3264 61.0395 30.353 61.5126 30.3792L62.0404 30.4086V29.88V29.04V28.54H61.5404C60.8509 28.54 60.4609 28.3639 60.2449 28.1202C60.1543 28.0034 60.0596 27.7993 59.9896 27.467C59.9191 27.1321 59.8804 26.6992 59.8804 26.16V15.04C59.8804 14.2285 60.0395 13.5212 60.3459 12.9069C60.6854 12.2533 61.1114 11.7624 61.6178 11.416C62.1501 11.0699 62.7208 10.9 63.3404 10.9C63.9751 10.9 64.358 11.0361 64.5774 11.2217L64.5863 11.2292L64.5955 11.2363C64.8381 11.4229 65.0259 11.7057 65.1368 12.1273L65.1368 12.1273L65.1386 12.1338C65.2565 12.5584 65.3204 13.0844 65.3204 13.72V26.16C65.3204 26.6992 65.2816 27.1321 65.2111 27.467C65.1396 27.8065 65.0423 28.0122 64.9499 28.1277C64.7679 28.3551 64.3945 28.54 63.6604 28.54H63.1604V29.04V29.88V30.407L63.6866 30.3793C64.187 30.353 64.9154 30.3265 65.8743 30.2998L65.8743 30.3L65.8874 30.2993C66.8648 30.2465 67.8558 30.22 68.8604 30.22C69.838 30.22 70.8293 30.2464 71.8341 30.2993L71.8341 30.2995L71.8472 30.2998C72.8596 30.3265 73.6142 30.353 74.1141 30.3793L74.6404 30.407V29.88V29.04V28.54H74.1404C73.2649 28.54 72.763 28.3505 72.5002 28.0927C72.2702 27.8402 72.0804 27.257 72.0804 26.16V15.4C72.0804 14.0246 71.9735 12.898 71.7455 12.0388C71.5451 11.1839 71.2099 10.4568 70.7237 9.87893C70.2584 9.32106 69.6227 8.90486 68.8446 8.61507C68.0689 8.28926 67.0924 8.14001 65.9404 8.14001C64.4593 8.14001 63.103 8.43391 61.8809 9.03073Z'
          stroke='hsl(var(--primary))'
        />
        <path
          d='M47.7658 26.1526L47.7673 26.1495C48.6438 24.4533 49.0631 22.2454 49.0631 19.56C49.0631 16.8746 48.6438 14.6668 47.7673 12.9705C46.8968 11.2855 45.6762 10.0433 44.1035 9.27118C42.5563 8.51167 40.7717 8.14001 38.7631 8.14001C36.8053 8.14001 35.0361 8.51263 33.466 9.26963L33.466 9.26962L33.4628 9.27118C31.8916 10.0425 30.659 11.2828 29.762 12.9647L29.7619 12.9647L29.7589 12.9705C28.8825 14.6668 28.4631 16.8746 28.4631 19.56C28.4631 22.2454 28.8825 24.4533 29.7589 26.1495L29.7588 26.1496L29.7636 26.1584C30.6615 27.8138 31.8941 29.0388 33.4628 29.8089L33.466 29.8104C35.0361 30.5674 36.8053 30.94 38.7631 30.94C40.7717 30.94 42.5563 30.5684 44.1035 29.8088C45.6737 29.038 46.8944 27.8111 47.7658 26.1526ZM36.5378 12.0481L36.5378 12.0481L36.5391 12.0452C37.2352 10.4982 38.0019 9.94001 38.7631 9.94001C39.552 9.94001 40.3177 10.5003 40.9844 12.0388L40.9843 12.0389L40.9885 12.0481C41.6609 13.5174 42.0231 15.998 42.0231 19.56C42.0231 23.122 41.6609 25.6026 40.9885 27.072L40.9884 27.0719L40.9856 27.0784C40.321 28.5866 39.5566 29.14 38.7631 29.14C37.9973 29.14 37.2319 28.5887 36.5378 27.072C35.8654 25.6026 35.5031 23.122 35.5031 19.56C35.5031 15.998 35.8654 13.5174 36.5378 12.0481Z'
          stroke='hsl(var(--primary))'
        />
        <path
          d='M23.3514 3.42213L23.35 3.42366C23.3402 3.43444 23.3334 3.43973 23.3301 3.442C23.3278 3.44355 23.3265 3.44419 23.326 3.44443C23.3258 3.44452 23.3257 3.44455 23.3256 3.44456C23.3256 3.44457 23.3254 3.44465 23.3249 3.44478C23.324 3.44504 23.322 3.44549 23.3185 3.4458C23.3131 3.4463 23.3027 3.4466 23.2861 3.44439C23.2098 3.43422 23.0598 3.37909 22.8245 3.20341C21.9108 2.48421 20.8643 1.86561 19.6885 1.34549C18.4804 0.771796 16.9621 0.5 15.16 0.5C12.3086 0.5 9.76581 1.14518 7.54673 2.4489L7.54672 2.44889L7.54435 2.4503C5.35758 3.75129 3.62917 5.56488 2.36145 7.87984L2.36143 7.87983L2.35926 7.88389C1.11406 10.2083 0.5 12.9054 0.5 15.96C0.5 19.0639 1.09915 21.75 2.32064 23.9987C3.5388 26.2412 5.24738 27.9652 7.44096 29.1592L7.44328 29.1604C9.66068 30.3523 12.2246 30.94 15.12 30.94C16.8965 30.94 18.3887 30.6812 19.5702 30.1337L19.5702 30.1337L19.575 30.1314C20.7159 29.5881 21.7903 28.963 22.7977 28.256C23.0586 28.0911 23.2269 28.0365 23.3182 28.0277C23.3463 28.025 23.3606 28.0272 23.3654 28.0283C23.3669 28.0297 23.3694 28.0322 23.373 28.0366L23.3813 28.0467L23.39 28.0563C23.4394 28.1107 23.5281 28.2665 23.616 28.6055C23.7 28.9295 23.7701 29.3669 23.8222 29.9263L23.8644 30.38H24.32H25.24H25.7656L25.7394 29.855C25.6864 28.7956 25.6465 27.4948 25.6199 25.9514C25.5933 24.3821 25.58 22.3319 25.58 19.8V19.3H25.08H24.16H23.7051L23.6622 19.7529C23.4773 21.7082 23.2018 23.2563 22.8431 24.4099C22.5026 25.4789 21.8595 26.3819 20.8951 27.1237L20.8694 27.1435L20.8464 27.1664C20.2606 27.7523 19.5494 28.2082 18.7053 28.5315C17.8778 28.8319 17.0568 28.98 16.24 28.98C14.9199 28.98 13.7978 28.6332 12.8516 27.9538C11.8839 27.2591 11.0802 26.3104 10.4454 25.0927C9.82986 23.8607 9.36384 22.454 9.0515 20.8681C8.76414 19.2467 8.62 17.5576 8.62 15.8C8.62 14.0678 8.76434 12.4043 9.05207 10.8087L9.05231 10.8073C9.3389 9.19202 9.77983 7.75634 10.3709 6.4962C10.9807 5.25228 11.7584 4.29384 12.6966 3.60253L12.6966 3.60259L12.7033 3.59748C13.6184 2.89916 14.7347 2.54 16.08 2.54C16.9832 2.54 17.8453 2.69032 18.6691 2.9899C19.48 3.28475 20.1911 3.73818 20.8064 4.35356L20.8294 4.37652L20.8551 4.39631C21.5026 4.89433 21.9879 5.44462 22.3237 6.0443C22.6712 6.66473 22.9495 7.39411 23.1541 8.2378L23.1549 8.24127C23.361 9.06567 23.5312 10.0818 23.6629 11.294L23.7114 11.74H24.16H25.08H25.58V11.24C25.58 8.78798 25.5933 6.8314 25.6199 5.36909L25.6199 5.36893C25.6465 3.879 25.6864 2.61825 25.7393 1.58561L25.7663 1.06H25.24H24.32H23.8644L23.8222 1.51369C23.7703 2.07129 23.6972 2.51001 23.6076 2.83844C23.515 3.17792 23.4178 3.3497 23.3514 3.42213Z'
          stroke='hsl(var(--primary))'
        />
      </svg>
    </div>
  );
}
