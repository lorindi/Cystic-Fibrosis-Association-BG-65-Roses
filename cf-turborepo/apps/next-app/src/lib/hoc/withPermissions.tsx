'use client';

import { ReactElement, useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { AccessDeniedModal } from '@/components/auth/AccessDeniedModal';
import { UserGroup } from '@/graphql/generated/graphql';
import { usePathname } from 'next/navigation';
import { getRequiredGroupsForPath, getSectionNameForPath } from '@/lib/utils/access-control';

// Тип, който указва, че пропсовете на компонента могат да бъдат различни
interface WithPermissionsProps {
  [key: string]: any;
}

// Версия, която приема explicit групи и име на секция
export function withPermissions(
  WrappedComponent: React.ComponentType<WithPermissionsProps>,
  requiredGroups: UserGroup[] = [],
  sectionName: string = 'this section'
) {
  // Връщаме нов компонент
  return function WithPermissionCheck(props: WithPermissionsProps): ReactElement {
    const { user } = useAuth();
    const [accessDenied, setAccessDenied] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    useEffect(() => {
      const checkPermissions = () => {
        // Ако потребителят е админ, винаги има достъп
        if (user?.role === 'admin') {
          setAccessDenied(false);
          setInitialCheckDone(true);
          return;
        }

        // Ако има изискване за групи
        if (requiredGroups.length > 0) {
          // Проверяваме дали потребителят има поне една от необходимите групи
          const hasRequiredGroup = user?.groups?.some((group: string) => 
            requiredGroups.includes(group as UserGroup)
          );

          // Ако няма необходимите групи, отказваме достъп
          if (!hasRequiredGroup) {
            setAccessDenied(true);
            setInitialCheckDone(true);
            return;
          }
        }

        // В другите случаи позволяваме достъп
        setAccessDenied(false);
        setInitialCheckDone(true);
      };

      // Изпълняваме проверката, когато се зареди потребителят
      if (user) {
        checkPermissions();
      }
    }, [user]);

    // Обработка на затваряне на модалния прозорец
    const handleCloseModal = () => {
      setAccessDenied(false);
    };

    // Ако все още не сме направили проверка, не показваме нищо
    if (!initialCheckDone && !user) {
      return <div className="w-full h-full flex justify-center items-center">Loading...</div>;
    }

    // Ако проверката е направена, но потребителят няма достъп, показваме съобщение
    if (accessDenied) {
      return <AccessDeniedModal isOpen={true} onClose={handleCloseModal} sectionName={sectionName} />;
    }

    // Ако потребителят има достъп, показваме оригиналния компонент
    return <WrappedComponent {...props} />;
  };
}

// Версия, която автоматично определя групите и името на секцията според текущия път
export function withPathPermissions(
  WrappedComponent: React.ComponentType<WithPermissionsProps>
) {
  // Връщаме нов компонент
  return function WithPathPermissionCheck(props: WithPermissionsProps): ReactElement {
    const { user } = useAuth();
    const pathname = usePathname();
    const [accessDenied, setAccessDenied] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);
    
    // Получаваме необходимите групи и името на секцията от текущия път
    const requiredGroups = getRequiredGroupsForPath(pathname || '');
    const sectionName = getSectionNameForPath(pathname || '');

    useEffect(() => {
      const checkPermissions = () => {
        // Ако потребителят е админ, винаги има достъп
        if (user?.role === 'admin') {
          setAccessDenied(false);
          setInitialCheckDone(true);
          return;
        }

        // Ако има изискване за групи
        if (requiredGroups.length > 0) {
          // Проверяваме дали потребителят има поне една от необходимите групи
          const hasRequiredGroup = user?.groups?.some((group: string) => 
            requiredGroups.includes(group as UserGroup)
          );

          // Ако няма необходимите групи, отказваме достъп
          if (!hasRequiredGroup) {
            setAccessDenied(true);
            setInitialCheckDone(true);
            return;
          }
        }

        // В другите случаи позволяваме достъп
        setAccessDenied(false);
        setInitialCheckDone(true);
      };

      // Изпълняваме проверката, когато се зареди потребителят
      if (user) {
        checkPermissions();
      }
    }, [user, pathname, requiredGroups]);

    // Обработка на затваряне на модалния прозорец
    const handleCloseModal = () => {
      setAccessDenied(false);
    };

    // Ако все още не сме направили проверка, не показваме нищо
    if (!initialCheckDone && !user) {
      return <div className="w-full h-full flex justify-center items-center">Loading...</div>;
    }

    // Ако проверката е направена, но потребителят няма достъп, показваме съобщение
    if (accessDenied) {
      return <AccessDeniedModal isOpen={true} onClose={handleCloseModal} sectionName={sectionName} />;
    }

    // Ако потребителят има достъп, показваме оригиналния компонент
    return <WrappedComponent {...props} />;
  };
} 