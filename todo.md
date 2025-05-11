# TODO

Description should save different language results. for example
ka: "გეიმინგ ლეპტოპი"
en: "gaming laptop"
ru: "..."

it will be ok if not all of them are filled, most important is for at least one of them to have value.

add column isCertified which is false by default

## Features

- SOLD LAPTOPS ADD MORE CONTENT
- USER PAGES / SHOP PAGEs
- [x] REPLACE TEXT WITH LOGO ON LANDING MOBILE
- Kaidoverified etc
- Optimistic updates (hearting)
- Backend multiple language support
- site statistics
- view count
- autotagging (rtx? gaming. price <2.5k? budget.)

## Improvements

- GEORGIAN FONT
- tooltips in content moderation
- system settings (define front page laptops)
- Chart for price ranges shadcn https://ui.shadcn.com/docs/components/chart
- slider step forms for registering initially, then for posting the laptop.

## Backend

- [ ] Move away from sqlite
- move to postgress
- many to many fix

## Frontend

- [ ] profile settings

## User Model & Registration

- [x] username
- [ ] joindate
- [ ] email verification (email must be verified to be able to post)
- [ ] facebook auth

## Admin

- [x] usable admin dashboard

  - [x] content moderation
  - [x] user moderation
  - [ ] laptop updating
    - [x] update from form
    - [ ] inline updating on the page

- [ ] Kaido verified

## Completed

- [x] Filtering
- [x] Favorites
- [x] Get distinct parts
- [x] Get amount of favorited items by user
- [x] turn key highlihgts into accordion
- [x] IsAdmin
- [x] profile page
- [x] approve in frontend as well
- [x] ux improvements in content moderation
- [x] tags
