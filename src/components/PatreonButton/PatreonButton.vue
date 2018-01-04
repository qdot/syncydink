<template lang="html">
  <div ref="patreonButton" id="patreon-button">
    <!-- I could either let patreon bring in ALL OF FUCKING REACT to render a button, or I could just cut it up and use this. -->
    <div class="_2KV-widgets-shared--patreonWidgetWrapper">
      <a class="sc-bxivhb ffInCX" color="primary" type="button" href="https://www.patreon.com/bePatron?u=2860444&amp;redirect_uri=http%3A%2F%2Fbuttplug.world%2Ftest.html&amp;utm_medium=widget" role="button">
        <div class="sc-htpNat gdWQYu">
          <div class="sc-gzVnrw dJCpyC" display="flex" wrap="nowrap" direction="[object Object]">
            <div class="sc-dnqmqq llsQFn">
              <span class="sc-htoDjs fqfmvk">
                <svg viewBox="0 0 569 546" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>Patreon logo</title><g><circle data-color="1" id="Oval" cx="362.589996" cy="204.589996" r="204.589996"></circle><rect data-color="2" id="Rectangle" x="0" y="0" width="100" height="545.799988"></rect></g></svg>
              </span>
            </div>
            <div class="sc-gqjmRU fFOxVX" width="1.5"></div>
            Give us money
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<style lang="css">
  /* Patreon button rendering CSS */
  
  ._2KV-widgets-shared--patreonWidgetWrapper {
    color: #052D49;
    font-family: 'America', 'GT America', 'Lato', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  #patreon-button {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  /* sc-component-id: sc-keyframes-iECmZH */
  @-webkit-keyframes iECmZH{0%{-webkit-transform:rotate(0deg);-ms-transform:rotate(0deg);transform:rotate(0deg);}100%{-webkit-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg);}}@keyframes iECmZH{0%{-webkit-transform:rotate(0deg);-ms-transform:rotate(0deg);transform:rotate(0deg);}100%{-webkit-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg);}}
  /* sc-component-id: sc-htpNat */
  .sc-htpNat {}
  .gdWQYu{visibility:visible;}
  /* sc-component-id: sc-bxivhb */
  .sc-bxivhb {}
  .ffInCX{-webkit-backface-visibility:hidden;backface-visibility:hidden;background-color:#F96854;border:2px solid #F96854;border-radius:0;box-sizing:border-box;color:#FFFFFF !important;display:inline-block;font-size:0.8090234857849197rem !important;font-weight:700;padding:0.5rem 0.75rem;position:relative;text-align:center;text-decoration:none;text-transform:uppercase;-webkit-transition:all 300ms cubic-bezier(0.19,1,0.22,1);transition:all 300ms cubic-bezier(0.19,1,0.22,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap;cursor:pointer;}.ffInCX:focus{box-shadow:0 0 8px 0 #358EFF;outline:none;}.ffInCX:hover{background-color:#FA7664;border-color:#FA7664;box-shadow:0 0.25rem 0.75rem rgba(5,45,73,0.09999999999999998);}.ffInCX:active{box-shadow:none;-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);}
  /* sc-component-id: sc-gzVnrw */
  .sc-gzVnrw {}
  .dJCpyC{-webkit-align-content:flex-start;-ms-flex-line-pack:flex-start;align-content:flex-start;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-grow:initial;-ms-flex-grow:initial;flex-grow:initial;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;styled-components:bug-fix;}@media (min-width:1rem){.dJCpyC{-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;}}
  /* sc-component-id: sc-htoDjs */
  .sc-htoDjs {}
  .fqfmvk{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}.fqfmvk svg{-webkit-align-self:center;-ms-flex-item-align:center;align-self:center;height:0.75rem;width:0.75rem;}.fqfmvk svg *[data-color='1']{fill:#FFFFFF;-webkit-transition:all 300ms cubic-bezier(0.19,1,0.22,1);transition:all 300ms cubic-bezier(0.19,1,0.22,1);}.fqfmvk svg *[data-color='2']{fill:#052D49;-webkit-transition:all 300ms cubic-bezier(0.19,1,0.22,1);transition:all 300ms cubic-bezier(0.19,1,0.22,1);}
  /* sc-component-id: sc-dnqmqq */
  .sc-dnqmqq {}
  .llsQFn{-webkit-align-self:center;-ms-flex-item-align:center;align-self:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-inline-box !important;display:-webkit-inline-flex !important;display:-ms-inline-flexbox !important;display:inline-flex !important;padding:NaNrem;}
  /* sc-component-id: sc-gqjmRU */
  .sc-gqjmRU {}
  .fFOxVX{width:0.75rem;height:1px;}
</style>