-- Ajouter un nouveau rôle à un utilisateur
INSERT INTO user_roles (user_id, role_id)
VALUES (
  'ID_DE_UTILISATEUR',
  (SELECT id FROM roles WHERE name = 'nom_du_role')
);

-- Retirer un rôle d'un utilisateur
DELETE FROM user_roles
WHERE user_id = 'ID_DE_UTILISATEUR'
AND role_id = (SELECT id FROM roles WHERE name = 'nom_du_role');

-- Mettre à jour les permissions d'un rôle
UPDATE roles
SET permissions = '["nouvelle_permission1", "nouvelle_permission2"]'
WHERE name = 'nom_du_role';

-- Lister tous les utilisateurs avec leurs rôles
SELECT 
  u.email,
  array_agg(r.name) as roles,
  array_agg(r.permissions) as all_permissions
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
GROUP BY u.email;
