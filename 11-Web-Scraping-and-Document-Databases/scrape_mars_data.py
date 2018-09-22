from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
import requests
import pymongo

def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=False)
    return browser


def scrape():
    browser = init_browser()
    listings = {}

    print("Before scrape 1")
    # Step 1 ; scrape 1

    url = "https://mars.nasa.gov/news/"
    browser.visit(url)

    html = browser.html
    soup = BeautifulSoup(html, "html.parser")

    news_title = soup.find("div", class_="content_title").get_text()
    news_p = soup.find("div", class_="article_teaser_body").get_text()

    listings["news_title"] = news_title
    listings["news_p"] = news_p

    print("Before scrape 2")
    # Step 1 ; scrape 2

    url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(url)

    browser.click_link_by_partial_text('FULL IMAGE')
    browser.is_element_present_by_text("more info", wait_time=0.5)
    browser.click_link_by_partial_text('more info')

    html = browser.html
    soup = BeautifulSoup(html, "html.parser")
    fig_1 = soup.find("figure", class_="lede")
    img_link = fig_1.a['href']
    featured_image_url = "https://www.jpl.nasa.gov" + img_link

    listings["img_link"] = featured_image_url

    print("Before scrape 3")
    # Step 1 ; scrape 3

    url = "https://twitter.com/marswxreport?lang=en"
    browser.visit(url)
    html = browser.html
    soup = BeautifulSoup(html, "html.parser")
    mars_weather = soup.find("div", class_="js-tweet-text-container").p.text
    
    listings["mars_weather"] = mars_weather

    print("Before scrape 4")
    # Step 1 ; scrape 4

    url = "http://space-facts.com/mars/"
    tables = pd.read_html(url)
    mars_html_table = tables[0].to_html

    listings["mars_html_table"] = mars_html_table

    print("Before scrape 5")
    # Step 1 ; scrape 5

    hemisphere_image_urls = []
    entry = {}
    url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    links = soup.find_all("a", class_="itemLink product-item")
    for link in links:
        print(link)
        img_url = "https://astrogeology.usgs.gov" + link['href']
        browser.visit(img_url)
        html = browser.html
        soup = BeautifulSoup(html, "html.parser")
        download_link = soup.find("div", class_="downloads").ul.li.a['href']
        entry['title'] = link.h3.text
        entry['img_url'] = download_link
        hemisphere_image_urls.append(entry)
        entry = {}
        print(download_link)
        print(link.h3.text)
        print('*' * 50)

    listings["hemisphere_image_urls"] = hemisphere_image_urls



    return listings




dict_listing = scrape()

print(dict_listing)

print(dic_listing['news_title'])
print(dic_listing['news_p'])
print(dic_listing['img_link'])
print(dic_listing['mars_weather'])
print(dic_listing['mars_html_table'])
for i in dic_listing['hemisphere_image_urls']:
  print(i['title'])
  print(i['img_url'])
  print('-' * 50)

