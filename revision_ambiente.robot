*** Settings ***
from selenium import webdriver
Library           SeleniumLibrary
Library           OperatingSystem
Library           String
Library           chromedriver
Suite Teardown    Run Keyword

*** Keywords ***
tear_down_actions

*** Variables ***
${user}        admin
${pass}        admin
${browser}     chrome
${testURL}     http://fermentkaffa.saraovalle.com/
${form}        xpath=/html/body/app-root/ion-app/ion-router-outlet/app-login/ion-content/div/form
${botonLog}    xpath=/html/body/app-root/ion-app/ion-router-outlet/app-login/ion-content/div/form/div/ion-button
${menu}        xpath=/html/body/app-root/ion-app/ion-router-outlet/app-home/ion-content/ion-header/ion-toolbar//div[2]
${vermenu}     xpath=/html/body/app-root/ion-app/ion-router-outlet/app-home/ion-content/ion-header/ion-toolbar/ion-buttons/ion-menu-button//button
${sidebar}     xpath=/html/body/app-root/ion-app/ion-menu/ion-content/ion-list
${regiones}    xpath=/html/body/app-root/ion-app/ion-router-outlet/app-home/ion-content/div/ion-row[2]/ion-col[1]/ion-card/ion-card-header/center/ion-img

*** Test Cases ***
Test 5
    Open Browser                     ${testURL}     ${browser}
    Wait Until Element Is Visible    ${form}
    Input Text    xpath=/html/body/app-root/ion-app/ion-router-outlet/app-login/ion-content/div/form/input[1]    ${user}
    Input Password    xpath=/html/body/app-root/ion-app/ion-router-outlet/app-login/ion-content/div/form/input[2]    ${pass}
    Wait Until Element Is Visible    ${botonLog}
    Click Element                    ${botonLog}
    Wait Until Element Is Visible    ${menu}
    Wait Until Element Is Visible    ${vermenu}
    Click Element                    ${vermenu}
    Wait Until Element Is Visible    ${sidebar}
    Wait Until Element Is Visible    ${regiones}
    Click Element                    ${regiones}



