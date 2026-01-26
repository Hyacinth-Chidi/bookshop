-- Create a readable view for books
DROP VIEW IF EXISTS book_readable_view;
CREATE OR REPLACE VIEW book_readable_view AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY f.name, d.name, b.level, b.title) AS "sn",
    b.title,
    b."courseCode",
    b."courseLecturer",
    b.price,
    b.quantity,
    f.name AS "facultyName",
    d.name AS "departmentName",
    b.level,
    b.semester,
    b.session,
    b."hasManual",
    b."manualPrice"
FROM 
    books b
LEFT JOIN 
    faculties f ON b."facultyId" = f.id
LEFT JOIN 
    departments d ON b."departmentId" = d.id;
