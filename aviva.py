#!/usr/bin/env python3
#
# selenium script to get aviva balance
#
# AVIVA_USER=user AVIVA_PWD=password ./aviva.py
#

import time
import re 
import os 
import undetected_chromedriver as uc
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

# Note: use_subprocess=False fails on mac, should be set true
# Note: drive is assumed to be x86-64 on linux, so we copy locally installed chromedriver
#
driver = uc.Chrome(headless=True,use_subprocess=False,driver_executable_path=os.environ['HOME']+"/.local/share/undetected_chromedriver/chromedriver_copy")

try:
    driver.get('https://www.direct.aviva.co.uk/MyAccount/login')

    wait = WebDriverWait(driver, 10)
    element = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR,'#onetrust-accept-btn-handler')))
    element.click()

    driver.find_element(By.CSS_SELECTOR,'#username').send_keys(os.environ['AVIVA_USER'])
    driver.find_element(By.CSS_SELECTOR,'#password').send_keys(os.environ['AVIVA_PWD'])

    driver.find_element(By.CSS_SELECTOR,'#loginButton').click()
    time.sleep(5)

    driver.find_element(By.PARTIAL_LINK_TEXT, 'Details').click()
    time.sleep(5)

    x = re.search('\"yourPensionValue\"[^0-9]*([0-9,.]*)[^0-9]*', driver.page_source) 

    print(x[1].replace(',', '')) 

except:
    driver.save_screenshot('debug-aviva-'+os.environ['AVIVA_USER']+'.png')
