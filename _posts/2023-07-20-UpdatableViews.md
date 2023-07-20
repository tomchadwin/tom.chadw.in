---
title: "Updatable views in PostgreSQL: Why and how?"
permalink: /wrote/UpdatableViews
# twitpic: https://tom.chadw.in/assets/pics/Thursbitch.jpg
description: >
    A technique useful both in relational spatial
    datasets and when you can't change the structure
    of your database
---

# Updatable views in PostgreSQL: Why and how?

A longstanding client requested a minimum viable product (MVP) for updating some of their data via a web front end.

Designing an MVP dictates the quickest development path possible to a deliverable solution. The web front end itself was the MVP, as the database already existed. Not touching the database would give us more time to work on this front-end GUI.

However, there was another stronger reason not to touch the existing database: it is live, the public querying it every day via website and app. It therefore made no sense to try to re-engineer live data for an MVP.

A final reason for not touching the existing database is that it stores the data in question in related tables. While useful for storing richly structured data, this is not ideal for geographical representation, and especially not for spatial use (in other words, on a web map). GIS works with features, expecting them to have a flat list of properties, not related tables of attributes.

My colleague Matt mentioned a technique he had used on the another project for the same client: updatable views. This technique had great potential for this MVP.

Databases store data in tables. Many systems query those tables directly, retrieving the data and presenting it to the user. However, databases also support views. Views don't have to be of single tables, but can be populated by complex SQL statements. They are often therefore used to gather data from many tables in a highly relational database into a human-readable form. In our case, they solve the problem of converting relational data in the database into flattened properties for the webmap features.

Database views are traditionally read-only. Their primary purpose is the presentation of data to the client. But Matt had mentioned updatable views. How is this done?

This project's database is PostgreSQL. While at a broad concept level, views are read-only, PostgreSQL does allow views to be updated: passing the updated values to the table on which the view is based. However, [there are severe limitations on which views can handle updates in this way](https://www.postgresql.org/docs/15/sql-createview.html). Our views did not fall within these limitations, so we have to do some more work to get this up and running.

Database triggers are "listeners" which can be assigned to fire when specific events occur. For example, a trigger can be created which fires when a specific table's data is updated. A trigger function is called, which carries out whatever ancillary function is required - perhaps inserting a row into another table.

A view can have triggers, and although a view is read-only, *it can still have a trigger which fires when an UPDATE query is made against it*.

This fact opens up a whole model of abstraction within the database itself: store the data in tables, create views, present the views' data to the client, and *query the view for create/review/update/delete (CRUD) operations*. Add triggers on the views to call functions to update the tables. This abstraction is extremely valuable in our use-case: we don't want to touch the underlying data structure at all, but still want to be able to update the underlying data.

So how does it work? For each view which you want to be able to update, create a trigger for each CRUD operation you want to support:

* ON BEFORE INSERT
* ON BEFORE UPDATE
* ON BEFORE DELETE

We set these triggers to fire BEFORE the events above because none of those SQL operations can succeed on a view: you can't INSERT, UPDATE, or DELETE something which is read-only. Each trigger calls a respective trigger function which carries out an INSERT, UPDATE, or DELETE on the related tables where the view's data is stored.

But how do we get the new data which the trigger function needs to update the tables? We coded the client to carry out the following pseudocode:

<code>UPDATE view SET view.field = CHANGED_VALUE;</code>

This fires the ON BEFORE UPDATE trigger, which calls our custom UPDATE function:

<code>UPDATE table SET table.field = CHANGED_VALUE;</code>

But how do we pass CHANGED_VALUE from the original query into the triggered function? In PSQL (PostgreSQL's SQL dialect), we use the NEW keyword:

<code>UPDATE table SET view.field = NEW.field;</code>

The NEW object has all the same properties as the original UPDATE had columns, with the values assigned in the original query.

And that's it. We can make our view as complex as we want (I could write a whole post about using <code>CROSSTAB</code> to destructure related tables), and then restructure the flat input and update whatever underlying tables we want. *The table structure is never touched.*

Thanks to Matt for sharing this valuable technique.