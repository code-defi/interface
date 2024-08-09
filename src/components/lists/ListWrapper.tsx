import { Trans } from '@lingui/macro';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, BoxProps, Paper, PaperProps, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useRootStore } from 'src/store/root';
import { DASHBOARD } from 'src/utils/mixPanelEvents';

import { toggleLocalStorageClick } from '../../helpers/toggle-local-storage-click';

interface ListWrapperProps {
  titleComponent: ReactNode;
  localStorageName?: string;
  subTitleComponent?: ReactNode;
  subChildrenComponent?: ReactNode;
  topInfo?: ReactNode;
  children: ReactNode;
  withTopMargin?: boolean;
  noData?: boolean;
  wrapperSx?: BoxProps['sx'];
  tooltipOpen?: boolean;
  paperSx?: PaperProps['sx'];
  bgColor?: string;
  icon?: ReactNode;
}

export const ListWrapper = ({
  children,
  localStorageName,
  titleComponent,
  subTitleComponent,
  subChildrenComponent,
  topInfo,
  withTopMargin,
  noData,
  wrapperSx,
  tooltipOpen,
  paperSx,
  bgColor,
  icon,
}: ListWrapperProps) => {
  const [isCollapse, setIsCollapse] = useState(
    localStorageName ? localStorage.getItem(localStorageName) === 'true' : false
  );
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleTrackingEvents = () => {
    if (!isCollapse) {
      switch (localStorageName as string | boolean) {
        case 'borrowAssetsDashboardTableCollapse':
          trackEvent(DASHBOARD.TILE_VISBILITY, {
            visibility: 'Hidden',
            type: 'Available Borrow Assets',
          });
          break;
        case 'borrowedAssetsDashboardTableCollapse':
          trackEvent(DASHBOARD.TILE_VISBILITY, { visibility: 'Hidden', type: 'Borrowed Assets' });
          break;
        case 'supplyAssetsDashboardTableCollapse':
          trackEvent(DASHBOARD.TILE_VISBILITY, {
            visibility: 'Hidden',
            type: 'Available Supply Assets',
          });
          break;
        case 'suppliedAssetsDashboardTableCollapse':
          trackEvent(DASHBOARD.TILE_VISBILITY, { visibility: 'Hidden', type: 'Supplied Assets' });
        default:
          return null;
      }
    } else {
      switch (localStorageName as string | boolean) {
        case 'borrowAssetsDashboardTableCollapse':
          trackEvent(DASHBOARD.TILE_VISBILITY, {
            visibility: 'Show',
            type: 'Available Borrow Assets',
          });
          break;
        case 'borrowedAssetsDashboardTableCollapse':
          trackEvent(DASHBOARD.TILE_VISBILITY, { visibility: 'Show', type: 'Borrowed Assets' });
          break;
        case 'supplyAssetsDashboardTableCollapse':
          trackEvent(DASHBOARD.TILE_VISBILITY, {
            visibility: 'Show',
            type: 'Available Supply Assets',
          });
          break;
        case 'suppliedAssetsDashboardTableCollapse':
          trackEvent(DASHBOARD.TILE_VISBILITY, { visibility: 'Show', type: 'Supplied Assets' });
        default:
          return null;
      }
    }
  };

  const collapsed = isCollapse && !noData;

  return (
    <Paper
      sx={[
        {
          mt: withTopMargin ? 4 : 0,
          border: 1,
          borderColor: 'divider',
          borderRadius: 4,
          background: bgColor,
        },
        ...(Array.isArray(paperSx) ? paperSx : [paperSx]),
      ]}
    >
      <Box display="flex" gap={5} alignItems={'center'} sx={{ px: 5, pt: 9, pb: 5 }}>
        <Box width={'100%'} flexShrink={1} minWidth={0}>
          {!!icon && icon}
          <Box
            sx={[
              {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              ...(Array.isArray(wrapperSx) ? wrapperSx : [wrapperSx]),
            ]}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: { xs: 'flex-start', xsm: 'center' },
                py: '3.6px',
                flexDirection: { xs: 'column', xsm: 'row' },
              }}
            >
              {titleComponent}
              {subTitleComponent}
            </Box>

            {!!localStorageName && !noData && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  minHeight: '28px',
                  pl: 3,
                  // span: {
                  //   width: '14px',
                  //   height: '2px',
                  //   bgcolor: 'text.secondary',
                  //   position: 'relative',
                  //   ml: 1,
                  //   '&:after': {
                  //     content: "''",
                  //     position: 'absolute',
                  //     width: '14px',
                  //     height: '2px',
                  //     bgcolor: 'text.secondary',
                  //     transition: 'all 0.2s ease',
                  //     transform: collapsed ? 'rotate(90deg)' : 'rotate(0)',
                  //     opacity: collapsed ? 1 : 0,
                  //   },
                  // },
                }}
                onClick={() => {
                  handleTrackingEvents();

                  !!localStorageName && !noData
                    ? toggleLocalStorageClick(isCollapse, setIsCollapse, localStorageName)
                    : undefined;
                }}
              >
                <Typography
                  variant="buttonM"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {collapsed ? (
                    <>
                      <Trans>Show</Trans> <KeyboardArrowDownIcon sx={{ ml: 1 }} />
                    </>
                  ) : (
                    <>
                      <Trans>Hide</Trans> <KeyboardArrowUpIcon sx={{ ml: 1 }} />
                    </>
                  )}
                </Typography>
                <span />
              </Box>
            )}
          </Box>

          {topInfo && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                pb: { xs: collapsed && !noData ? 6 : 2, xsm: collapsed && !noData ? 6 : 0 },
                overflowX: tooltipOpen ? 'hidden' : 'auto',
              }}
            >
              {topInfo}
            </Box>
          )}
          {subChildrenComponent && !collapsed && (
            <Box sx={{ marginBottom: { xs: 2, xsm: 0 } }}>{subChildrenComponent}</Box>
          )}
          <Box sx={{ display: collapsed ? 'none' : 'block' }}>{children}</Box>
        </Box>
      </Box>
    </Paper>
  );
};
